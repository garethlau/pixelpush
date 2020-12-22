import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";
import { SnackbarProvider } from "notistack";

import theme from "./theme";
import { UploadQueueProvider } from "./_contexts/uploadQueue";
import { UploadProgressProvider } from "./_contexts/uploadProgress";

import Home from "./_pages/Home";
import Upload from "./_pages/Upload";
import Font from "./_pages/Font";
import Album from "./_pages/Album";
import Authenticate from "./_pages/Authenticate";

const snackbarConfig = {
  maxSnack: 1,
  anchorOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  hideIconVariant: true,
};

function App() {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider {...snackbarConfig}>
        <QueryClientProvider client={queryClient}>
          <UploadQueueProvider>
            <UploadProgressProvider>
              <Router>
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/upload" component={Upload} />
                  <Route path="/albums/:albumCode" component={Album} />
                  <Route path="/font" component={Font} />
                  <Route path="/signup">
                    <Authenticate isLogin={false} />
                  </Route>
                  <Router path="/login">
                    <Authenticate isLogin={true} />
                  </Router>
                </Switch>
              </Router>
            </UploadProgressProvider>
          </UploadQueueProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
