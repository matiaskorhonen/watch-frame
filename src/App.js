import React, { Component } from "react";
import { Radio, RadioGroup } from "@blueprintjs/core";

import whiteWatch from "./white.png";
import blackWatch from "./black.png";

import "normalize.css";
import "@blueprintjs/core/dist/blueprint.css";
import "./App.css";


class App extends Component {
  constructor () {
    super()
    this.state = {
      colour: "black",
      file: undefined,
      showOverlay: false
    }
  }

  componentDidMount() {
    this.updateCanvas();
    this.mountFileDrop();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  drawScreen(ctx) {
    if (this.state.file) {
      var screenshot = new Image();
      screenshot.onload = function() {
        ctx.drawImage(screenshot, 374, 339, 276, 345);
      }
      screenshot.src = URL.createObjectURL(this.state.file);
    }
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    let baseImage = new Image();

    baseImage.onload = function() {
      ctx.drawImage(baseImage, 0, 0);
      this.drawScreen(ctx);
    }.bind(this)

    switch (this.state.colour) {
      case "black":
        baseImage.src = blackWatch;
        break;
      case "white":
        baseImage.src = whiteWatch;
        break;
      default:
        console.error(`Unknown colour: ${this.state.colour}`)
    }
  }

  drop(event) {
    event.preventDefault();
    this.hideOverlay();

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

    if (imageFiles.length) {
      this.setState({ file: imageFiles[0] })
    }
  }

  dragover(event) {
    event.preventDefault();
    this.showOverlay();
  }

  dragend(event) {
    event.preventDefault();
    if (!event.clientX && !event.clientY) {
      this.hideOverlay();
    }

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

  dragleave(event) {
    if (!event.clientX && !event.clientY) {
      this.hideOverlay();
    }
  }

  selectFile(event) {
    this.setState({file: event.target.files[0]})
  }

  mountFileDrop() {
    var appEl = this.refs.app;
    appEl.ondrop = this.drop.bind(this);
    appEl.ondragover = this.dragover.bind(this);
    appEl.ondragend = this.dragend.bind(this);
    appEl.ondragleave = this.dragleave.bind(this);
  }

  handleColourChange(event) {
    this.setState({ colour: event.target.value });
    this.updateCanvas();
  }

  showOverlay() {
    this.setState({ showOverlay: true });
  }

  hideOverlay() {
    this.setState({ showOverlay: false });
  }

  render() {
    return (
      <div ref="app" className="app">
        <div className="app-content">
          <div className="band-selection">
            <RadioGroup onChange={this.handleColourChange.bind(this)}
                        selectedValue={this.state.colour}>
                <Radio label="Black band" value="black" />
                <Radio label="White band" value="white" />
            </RadioGroup>
          </div>

          <canvas ref="canvas" width={1024} height={1024} />

          <label className="pt-file-upload">
            <input  onChange={this.selectFile.bind(this)}
                    type="file"
                    accept=".jpg,.jpeg,.png,.tif,.tiff,.bmp,.gif" />
            <span className="pt-file-upload-input">{this.state.file ? this.state.file.name : "Choose file…"}</span>
          </label>
        </div>
        <div ref="overlay" className={this.state.showOverlay ? "app-overlay" : "app-overlay hidden"}>
          <p>Drop a screenshot here…</p>
        </div>
      </div>
    );
  }
}

export default App;
