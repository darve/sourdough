
import xhr from 'axios';

const save = async (filename, svg) => new Promise((resolve, reject) => {
    xhr.post('http://localhost:3001/save', { filename, svg })
        .then((response) => resolve(response.data)).catch(err => reject(err));
});

const bundle = async (folder_name, svg, filename) => new Promise((resolve, reject) => {
    xhr.post('http://localhost:3001/bundle', { svg, folder_name, filename })
        .then((response) => resolve(response.data)).catch(err => reject(err));
});

const save_data = async (filename, data) => new Promise((resolve, reject) => {
    xhr.post('http://localhost:3001/save-data', { filename, data })
        .then((response) => resolve(response.data)).catch(err => reject(err));
});

const save_frame = async (filename, frame, png) => new Promise(( resolve, reject) => {
    xhr.post('http://localhost:3001/frame', { filename, frame, png })
        .then(response => resolve(response.data)).catch(err => reject(err));
})

export default {
    save: save,
    save_frame: save_frame,
    bundle: bundle
}
