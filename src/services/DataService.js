import * as authService from './Authentication';
import * as toastService from './ToastService';
import * as constant from './Constant';
import axios from 'axios';

function getHeader() {
  var header = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + authService.getLoggedInUser().access_token,
  };
  return header;
}

function getHeaderDownload() {
  var header = {
    'Content-Type': 'application/octet-stream',
    Authorization: 'Bearer ' + authService.getLoggedInUser().access_token,
  };
  return header;
}

// function handleErrors(response) {
//   if (!response.ok) {
//     throw Error(response.statusText);
//   }
//   return response;
// }
function getHeaderWithoutBearer() {
  var header = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return header;
}
// const header = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
//   Authorization: "Bearer " + authService.getLoggedInUser().access_token
// };

// const headerWithoutBearer = {
//   Accept: "application/json",
//   "Content-Type": "application/json"
// };

export const login = async data => {
  try {
    return await axios
      .post(constant.BASE_URL + 'api/accounts/generatetoken', data, {
        headers: getHeaderWithoutBearer(),
      })
      .then(res => {
        return res;
      })
      .catch(error => {
        return error.response;
      });
  } catch (error) {
    toastService.error('Error:  ' + error);
  }
};

export const getOnlineData = async url => {
  try {
    return await axios
      .get(url)
      .then(res => {
        return res.data;
      })
      .catch(error => {
        return error.response;
      });
  } catch (error) {
    toastService.error('Error:  ' + error);
  }
};

export const get = async url => {
  try {
    return await axios
      .get(constant.BASE_URL + url, {headers: getHeader()})
      .then(res => {
        return res.data;
      })
      .catch(error => {
        return error.response;
      });
  } catch (error) {
    toastService.error('Error:  ' + error);
  }
};

export const post = async (url, data) => {
  try {
    return await axios
      .post(constant.BASE_URL + url, JSON.stringify(data), {
        headers: getHeader(),
      })
      .then(res => {
        return res;
      })
      .catch(error => {
        return error.response;
      });
  } catch (error) {
    toastService.error('Error:  ' + error);
  }
};

export const upload = async (url, type, name, uri) => {
  try {
    var data = new FormData();
    data.append('file', {type: type, name: name, uri: uri});
    return axios
      .post(constant.BASE_URL + url, data)
      .then(res => {
        return res.data;
      })
      .catch(error => {
        return error.response;
      });
  } catch (error) {
    toastService.error('Error:  ' + error);
  }
};

// export const postAndGetJson = async (url, data) => {
//   return await fetch(constant.BASE_URL + url, {
//     method: "POST",
//     headers: getHeader(),
//     body: JSON.stringify(data)
//   }).then(function(response) {
//     if (response.status == 401) {
//       window.location.assign(constant.BASE_URL + "notallow");
//     } else {
//       return response.data;
//     }
//   });
// };

export const put = async (url, data) => {
  try {
    return await axios
      .put(constant.BASE_URL + url, JSON.stringify(data), {
        headers: getHeader(),
      })
      .then(res => {
        return res;
      })
      .catch(error => {
        return error.response;
      });
  } catch (error) {
    toastService.error('Error:  ' + error);
  }
};

export const remove = async url => {
  try {
    return await axios
      .delete(constant.BASE_URL + url, {headers: getHeader()})
      .then(res => {
        return res;
      })
      .catch(error => {
        return error.response;
      });
  } catch (error) {
    toastService.error('Error:  ' + error);
  }
};

export const download = async (url, fileName) => {
  try {
    axios({
      url: constant.BASE_URL + url,
      method: 'GET',
      responseType: 'blob', // important
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
  } catch (error) {
    toastService.error('Error:  ' + error);
  }
};

export const getProvince = async () => {
  try {
    var cities = await axios
      .get(constant.BASE_URL + 'api/cities/getall', {headers: getHeader()})
      .then(res => {
        return res.data;
      })
      .catch(error => {
        return error.response;
      });

    var data = [];
    if (cities.items) {
      for (var i = 0; i < cities.items.length; i++) {
        data.push({
          name: cities.items[i].city,
        });
      }
    }
    return data;
  } catch (error) {
    toastService.error('Error:  ' + error);
  }
};

export const getState = async () => {
  try {
    var states = await axios
      .get(constant.BASE_URL + 'api/states/getall', {headers: getHeader()})
      .then(res => {
        return res.data;
      })
      .catch(error => {
        return error.response;
      });

    var data = [];
    if (states.items) {
      for (var i = states.items.length - 1; i >= 0; i--) {
        data.push({
          name: states.items[i].state,
        });
      }
    }
    return data;
  } catch (error) {
    toastService.error('Error:  ' + error);
  }
};
