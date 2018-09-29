import axios from 'axios';

export default class AnalyzeService {

  analyze(directory) {
    return axios.put('/api/image/scrape').then(response => {
      console.log(response);
    });
  }

}