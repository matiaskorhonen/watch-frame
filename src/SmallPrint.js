import React, { Component } from "react";

import "./SmallPrint.css";

class SmallPrint extends Component {
  render() {
    return (
      <div className="smallprint">
        <small>
          Apple Watch® Series 2 images © Copyright 2016 Apple Inc.
          <br />
          By using them you agree to the <a href="https://developer.apple.com/app-store/marketing/guidelines/">
          App Store Marketing Guidelines</a> and the iOS App Store Marketing
          Artwork License Agreement.
        </small>
      </div>
    );
  }
}

export default SmallPrint;
