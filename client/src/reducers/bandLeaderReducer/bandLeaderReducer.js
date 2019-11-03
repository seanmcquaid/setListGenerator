import {
    ADD_SONG_LOADING,
    ADD_SONG_SUCCESS,
    ADD_SONG_ERROR,
} from "../../actions/bandLeaderActions/bandLeaderActionTypes";

const initialState = {
    setLists : [],
    clientList : [],
    bandLists : [],
    songList : [],
    isLoading : false,
    errorData : {
        status : null,
        errorMessage : null,
    }
}

const bandLeaderReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_SONG_LOADING :
        return {
            ...state,
            isLoading : true
        }
        case ADD_SONG_SUCCESS :
            return {
                ...state,
                songList : action.payload.songList,
                isLoading : false,
            }
        case ADD_SONG_ERROR :
            return {
                ...state,
                isLoading : false,
                errorData : {
                    status : action.payload.status,
                    errorMessage : action.payload.data.errorMessage
                }
            }
        default :
        return {
            ...state
        }
    }
}

export default bandLeaderReducer;