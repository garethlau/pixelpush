import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";

import theme from "./theme";
import { UploadQueueProvider } from "./_contexts/uploadQueue";
import { UploadProgressProvider } from "./_contexts/uploadProgress";

import Home from "./_pages/Home";
import Upload from "./_pages/Upload";
import Font from "./_pages/Font";
import Album from "./_pages/Album";

function App() {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <UploadQueueProvider>
          <UploadProgressProvider>
            <Router>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/upload" component={Upload} />
                <Route path="/albums/:albumCode" component={Album} />
                <Route path="/font" component={Font} />
              </Switch>
            </Router>
          </UploadProgressProvider>
        </UploadQueueProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
