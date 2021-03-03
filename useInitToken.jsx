/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import decryptJwt from 'jwt-decode';
import axios from 'axios'
import useLocalState from '../../../libs/useLocalState';
import { API_URL } from '../../App.config';
import useDidMount from '../../../libs/Hooks/UseDidMount';

export const TokenState = {
  TOKEN_STATE_VALID  : "TOKEN_VALID",
  TOKEN_STATE_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_STATE_MISSING: "TOKEN_MISSING"
}

function verifyToken (token) {
    if (token && token !== null && typeof (token) !== 'undefined') {
      const tok = decryptJwt(token);
  
      const { exp: expiration } = tok;
      if (expiration * 1000 > new Date().getTime()) {
        return TokenState.TOKEN_STATE_VALID;
      } else return TokenState.TOKEN_STATE_EXPIRED;
    }
    return TokenState.TOKEN_STATE_MISSING;
}

export const getTokenData = ( token, field ) => {
  if (token !== null) {
    const data = token[field];
    if (data !== undefined) {
      return data;
    }
    return null;
  }
  return null;
}



const useTokenState = ( token ) => {
  const [ tokenState, setTokenState ] = useState( verifyToken(token) );

  useEffect(() => {
    if ( verifyToken(token) !== tokenState )
      setTokenState( verifyToken(token) );
  }, [ token, tokenState ]);

  return tokenState
}
/**
 * @author Hermann
 * @description Ici se token va déterminer si le token est valide
 */
const refresh = async ( authToken, refreshToken ) => {
  return axios.post(`${API_URL}/auth/token/refresh`, {
    access_token: authToken,
    refresh_token: refreshToken,
  }).then(({ data }) => data)
};

export const useInitToken = () => {
  const [ authToken, setAuthToken, deleteAuthToken ] = useLocalState("authToken");
  const [ refreshToken, setRefreshToken, deleteRefreshToken ] = useLocalState("refreshToken");
  const tokenState = useTokenState(  authToken );
  const [ tokenData, setTokenData ] = useState( tokenState === TokenState.TOKEN_STATE_VALID && authToken !== undefined ? decryptJwt(authToken) : false) 



  // useEffect(() => {
  //   console.log(authToken !== undefined);
  // }, [authToken]);

  useDidMount(() => {
    const ref = async () => {
      await axios.post(`${API_URL}/auth/token/refresh`, {
        access_token: authToken,
        refresh_token: refreshToken,
      })
      .then( ({ data }) => {
        console.log("refresh success")
        setAuthToken(data.access_token);
        setRefreshToken(data.refresh_token);
      })
      .catch( err => {
        console.log("refresh failed")
        deleteAuthToken();
        deleteRefreshToken();
      });
    }
    if (tokenState !== TokenState.TOKEN_STATE_MISSING) ref();
  });

  useEffect(() => {
    if ( authToken !== undefined) {
      if (  tokenState === TokenState.TOKEN_STATE_VALID ) setTokenData( decryptJwt(authToken) );
    }
  }, [ tokenState, authToken ]);

  useEffect(() => {
    const ref = async () => {
        await  axios.post(`${API_URL}/auth/token/refresh`, {
          access_token: authToken,
          refresh_token: refreshToken,
        })
        .then( ({ data }) => {
          console.log("refresh success")
          setAuthToken(data.access_token);
          setRefreshToken(data.refresh_token);
        })
        .catch( err => {
          console.log("refresh failed")
          deleteAuthToken();
          deleteRefreshToken();
        });
    }
    let refreshIt = null;
    if (tokenState !== TokenState.TOKEN_STATE_MISSING) {
      refreshIt = setInterval(() => {
        ref();
      }, 180000);
    }
    return () => refreshIt !== null && clearInterval(refreshIt)
  },  [ authToken, tokenState, setAuthToken, refreshToken, setRefreshToken, deleteAuthToken, deleteRefreshToken ])

  useEffect(() => {
    if (authToken)
      if (tokenState === TokenState.TOKEN_STATE_VALID)
        globalThis.axios.defaults.headers.Authorization = `Bearer ${authToken}`;
  }, [authToken, tokenState])

  return { 
    authToken, 
    setAuthToken, 
    tokenState, 
    refresh : async () => await refresh(authToken, refreshToken)
      .then(({ access_token, refresh_token }) => {setAuthToken(access_token); setRefreshToken(refresh_token)})
      .catch((err) => { deleteAuthToken(); deleteRefreshToken(); }),
    refreshToken, 
    setRefreshToken, // Enveler dés que le refresh Token est prêt
    tokenData,
    destroy : () => { deleteAuthToken(); deleteRefreshToken() } };
};

export default useInitToken;
