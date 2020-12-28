let albums = {};

const EventTypes = {
  IMAGE_LIST_UPDATED: "IMAGE_LIST_UPDATED",
  ALBUM_DELETED: "ALBUM_DELETED",
};

function subscribe(req, res) {
  const { albumCode } = req.params;
  // Haders and http status to keep connection open
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no", // https://serverfault.com/questions/801628/for-server-sent-events-sse-what-nginx-proxy-configuration-is-appropriate
  };
  res.writeHead(200, headers);

  const data = `data: ${JSON.stringify({
    message: "Subscribed to event source",
  })}\n\n`;
  res.write(data);

  if (!albums[albumCode]) {
    albums[albumCode] = [];
  }

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
  };
  albums[albumCode].push(newClient);

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    albums[albumCode] = albums[albumCode].filter((c) => c.id !== clientId);
    if (albums[albumCode].length === 0) {
      let newAlbums = Object.assign({}, albums);
      delete newAlbums[albumCode];
      albums = newAlbums;
    }
  });
}

// Wrapper arround sendToClients function for single events without data
function notifyClients(albumCode, event) {
  sendToClients(albumCode, { event });
}

function sendToClients(albumCode, data) {
  const clients = albums[albumCode];
  clients.forEach((client) =>
    client.res.write(`data: ${JSON.stringify(data)}\n\n`)
  );
}

module.exports = {
  sendToClients,
  notifyClients,
  subscribe,
  EventTypes,
};
