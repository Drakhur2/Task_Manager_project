
class Library {

    constructor(){
    }
    
    
    async Get(uri){ // Tested, Works
        let response;
        try{

            console.log("requesting data");
            const requestOptions = {
            method: 'GET',
            headers: {"content-type": "application/json"}          //the request options 
            };

            response = await fetch(uri, requestOptions);

            if(!response.ok){
                throw new Error("posibly duplicate");
            };

            return await response.json();

        }catch(error){
            console.log('Error', error);
            return error;
        }
    }

    async Put(targetURL, data){ 
        let response;

        try{
            console.log("sending data to server");
            const requestOptions = {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),                                                          // it is a plain text
            };
            response = await fetch(targetURL, requestOptions);
            console.log("testing the update");
            location.reload();
            return await response.json();
        }catch(error){
            console.log('Error: ', error);
        }
    };
    
    async Delete(targetURL, data) { // working //
        let response;
    
        try{
            console.log("deleting task");
            
            const requestOptions = {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),                                   //the delete uses the id to find and delete the item
            };
                
            response = await fetch(targetURL, requestOptions);
            
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`); 
            }
            location.reload();
        }catch(error){
            console.error("Could not delete",error);
            return `${error}`;
        }
            
    };
    async Post(targetURL, data){
        let response;
        try{

            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }
            response = await fetch(targetURL, requestOptions);
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.statusText}`);
            }
            const resp = await response.json();
            location.reload();

        } catch(error){
            console.log(`${error}`);
            throw error;
        }
    }
}
