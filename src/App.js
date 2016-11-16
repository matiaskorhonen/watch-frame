import React, { Component } from "react";
// import whiteWatch from "./white.png";
import blackWatch from "./black.png";

import "normalize.css";
import "./App.css";

class App extends Component {
  componentDidMount() {
    this.updateCanvas();
    this.mountFileDrop();
  }

  updateCanvas(file) {
    const ctx = this.refs.canvas.getContext('2d');
    var baseImage = new Image();
    baseImage.onload = function() {
      ctx.drawImage(baseImage, 0, 0);
    }
    baseImage.src = blackWatch;

    if (file) {
      var screenshot = new Image();
      screenshot.onload = function() {
        ctx.drawImage(screenshot, 374, 339, 276, 345);
      }
      screenshot.src = URL.createObjectURL(file);
    }
  }

  drop(event) {
    event.preventDefault();

    var i, files = [];

    // If dropped items aren't files, reject them
    const dt = event.dataTransfer;
    if (dt.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (i = 0; i < dt.items.length; i++) {
        if (dt.items[i].kind === "file") {
          files.push(dt.items[i].getAsFile());
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (i = 0; i < dt.files.length; i++) {
        files.push(dt.files[i]);
      }
    }

    const imageRe = /\.(jpe?g|gif|png|tiff?|bmp)$/i;
    let imageFiles = files.filter(function(file) {
      return imageRe.test(file.name);
    });

    this.updateCanvas(imageFiles[0]);
  }

  dragover(event) {
    event.preventDefault();
  }

  dragend(event) {
    event.preventDefault();

    // Remove all of the drag data
    const dt = event.dataTransfer;
    if (dt.items) {
      // Use DataTransferItemList interface to remove the drag data
      for (var i = 0; i < dt.items.length; i++) {
        dt.items.remove(i);
      }
    } else {
      // Use DataTransfer interface to remove the drag data
      event.dataTransfer.clearData();
    }
  }

  selectFile(event) {
    this.updateCanvas(event.target.files[0]);
  }

  mountFileDrop() {
    var appEl = this.refs.app;
    appEl.ondrop = this.drop.bind(this);
    appEl.ondragover = this.dragover;
    appEl.ondragend = this.dragend;
  }

  render() {
    return (
      <div ref="app" className="app">
        <div className="app-content">
          <canvas ref="canvas" width={1024} height={1024}/>
          <input  onChange={this.selectFile.bind(this)}
                  type="file"
                  accept=".jpg,.jpeg,.png,.tif,.tiff,.bmp,.gif" />
        </div>
      </div>
    );
  }
}

export default App;
