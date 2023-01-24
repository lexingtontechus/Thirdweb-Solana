import { getUser } from "../../auth.config"

const handler = async (req, res) => {
  const user = await getUser(req)

  if (!user) {
    return res.status(401).json({
      message: "Not authorized."
    })
  }

  return res.status(200).json({
    message: `This is a secret for ${user.address}.`
  })
}

export default handler
