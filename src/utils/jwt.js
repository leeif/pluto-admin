import Decode from 'jwt-decode'

export function parseJWT(jwt) {
  var decoded = Decode(jwt)
  console.log(decoded)
  return decoded
}
