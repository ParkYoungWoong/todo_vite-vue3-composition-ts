import axios from 'axios'

const { APIKEY, USERNAME } = process.env

export default async function (req, res) {
  const { path = '', method = 'GET', data } = req.body
  const { data: responseValue } = await axios({
    url: `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${path}`,
    method,
    headers: {
      'content-type': 'application/json',
      apikey: APIKEY,
      username: USERNAME
    },
    data
  })
  res.status(200).json(responseValue)
}
