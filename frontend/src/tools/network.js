import JwtDecode from "jwt-decode";   
   
    export const post = (url, body, callbackSuccess, callbackError) => {

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(body)
        };
        fetch(url, requestOptions)
            .then(async response => {
            const data = await response.json();
        
            if (!response.ok) {
                const error = (data && data.message) || response.status;
                return callbackError(error);
            }
        
            callbackSuccess(data);
            })
            .catch(error => {
                callbackError(error);
            });
    }

    export const get = (url, callbackSuccess, callbackError) => {

        let headers =  {
            'Content-Type':'application/json'
        };

          fetch(url, { headers })
            .then(async response => {
                const data = await response.json();
    
                if (!response.ok) {
                  const error = (data && data.message) || response.status;
                  return callbackError(error);
                }
          
                callbackSuccess(data);
            })
            .catch(error => {
                callbackError(error);
            });
    }   

    export const tokenAvailable = function () {

        let token = readToken();

        if(token != undefined){
            let sessionData = JwtDecode(token);
            
            let currentTimestamp = Date.now() / 1000;

            if(currentTimestamp < sessionData.exp && currentTimestamp >= sessionData.iat && sessionData.iss == "{aud}"){
                if(sessionData.data.id != null){
                    return true;
                }
            } 
        }
        return false;
    }


    export const writeToken = function(token) {
        localStorage.setItem('user-token', token);
    }

    export const readToken = function() {
        return localStorage.getItem('user-token');
    }

    export const backendRoute = "{server-endpoint}";