import http from "http"
import fs from "fs/promises"
import { execFile } from "child_process"
import path from "path"
import os from "os"

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/compile") {
    res.writeHead(404)
    return res.end()
  }

  let latex = ""
  req.on("data", chunk => (latex += chunk))
  req.on("end", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "latex-"))
    const texPath = path.join(dir, "main.tex")

    await fs.writeFile(texPath, latex)

    execFile(
      "tectonic",
      ["main.tex"],
      { cwd: dir, timeout: 15000 },
      async (err) => {
        if (err) {
          res.writeHead(400)
          return res.end(err.message)
        }

        const pdf = await fs.readFile(path.join(dir, "main.pdf"))
        res.writeHead(200, { "Content-Type": "application/pdf" })
        res.end(pdf)
      }
    )
  })
})

server.listen(8080)
