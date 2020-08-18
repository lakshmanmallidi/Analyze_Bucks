import settings from "./app_settings.json"

function getServerUrl() {
    if(settings.debug===true) {
        return "http://localhost:8000/"
    }
    else{
        return settings.public_url
    }
}

export default getServerUrl;