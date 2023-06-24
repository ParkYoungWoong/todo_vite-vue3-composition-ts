import axios from 'axios'
import { VercelRequest, VercelResponse } from '@vercel/node'

const { APIKEY, USERNAME } = process.env

interface RequestBody {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: '' | 'deletions' | 'reorder'
  data: { [key: string]: unknown }
}
export default async function (req: VercelRequest, res: VercelResponse) {
  const { path = '', method = 'GET', data } = req.body as Partial<RequestBody>
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
