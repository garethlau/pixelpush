import { BrowserView, MobileView } from "react-device-detect";
import PhotoBrowser from "./PhotoBrowser";
import PhotoMobile from "./PhotoMobile";

export default function Photo(props) {
  return (
    <>
      <BrowserView>
        <PhotoBrowser {...props} />
      </BrowserView>
      <MobileView>
        <PhotoMobile {...props} />
      </MobileView>
    </>
  );
}
