import React, { Component } from 'react';
import axios from 'axios';

const server = 'http://localhost:5000/';

class App extends Component {
  state = {
    image: [],
    imageUrls: [],
    message: ''
  }
  selectImage = (event) => {
    let image = [];
    for (let i = 0; i < event.target.files.length; i++) {
      let img = new Image()
      img.src = window.URL.createObjectURL(event.target.files[i])

      image[i] = event.target.files.item(i);

      img.onload = () => {
        if (img.width === 1024 && img.height === 1024) {
          alert(`Nice, image is the right size. It can be uploaded`);
        } else {
          alert(`Sorry, this image doesn't look like the size we wanted. It's 
        ${img.width} x ${img.height} but we require 1024x 1024 size image.`);
          image.splice(i, 1);
        }
      }
    }
    image = image.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
    let message = `${image.length} valid image(s) selected`
    this.setState({ image, message })
  }

  uploadImage = () => {
    const uploaders = this.state.image.map(image => {
      const data = new FormData();
      data.append("image", image, image.name);
      console.log('data', data);
      // Make an AJAX upload request using Axios
      return axios.post(server + 'upload', data)
        .then(response => {
          this.setState({
            imageUrls: [response.data.imageUrl, ...this.state.imageUrls]
          });
        });
    });

    // Once all the files are uploaded 
    axios.all(uploaders).then(() => {
      console.log('Uploaded');
    }).catch(err => alert(err.message));
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 mr30tb">
            <h2>Upload a Image</h2>
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="col-sm-4">
            <input className="form-control " type="file"
              onChange={this.selectImage} />
            <p className="text-info">{this.state.message}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <button className="btn pull-right btn-success" value="Submit"
              onClick={this.uploadImage}>Upload Local</button>
          </div>
        </div>
        <div className="row mr30tb">
          {
            this.state.imageUrls.map((url, i) => (
              <div className="col-sm-2" key={i}>
                <img src={server + url} className="img-rounded img-responsive"
                  alt="Image" /><br />
              </div>
            ))
          }
        </div>
      </div >
    );
  }
}
export default App;