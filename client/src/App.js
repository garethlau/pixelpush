import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";
import { SnackbarProvider } from "notistack";

import theme from "./theme";
import { UploadQueueProvider } from "./_contexts/uploadQueue";
import { UploadProgressProvider } from "./_contexts/uploadProgress";
import { PhotoDetailsProvider } from "./_contexts/photoDetails";

import Home from "./_pages/Home";
import Album from "./_pages/Album";
import Authenticate from "./_pages/Authenticate";
import { ShareModalProvider } from "./_contexts/shareModal";

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
          <PhotoDetailsProvider>
            <UploadQueueProvider>
              <UploadProgressProvider>
                <Router>
                  <Switch>
                    <Route path="/" exact component={Home} />
                    {/* <Route path="/albums/:albumCode" component={Album} /> */}
                    <Route
                      path="/albums/:albumCode"
                      render={(routeProps) => (
                        <ShareModalProvider>
                          <Album {...routeProps} />
                        </ShareModalProvider>
                      )}
                    />
                    <Route
                      path="/signup"
                      render={(routeProps) => <Authenticate {...routeProps} />}
                    />
                    <Route
                      path="/login"
                      render={(routeProps) => (
                        <Authenticate {...routeProps} isLogin />
                      )}
                    />
                  </Switch>
                </Router>
              </UploadProgressProvider>
            </UploadQueueProvider>
          </PhotoDetailsProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
