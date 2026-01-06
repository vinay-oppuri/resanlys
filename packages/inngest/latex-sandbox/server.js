import http from "http"
import fs from "fs/promises"
import { execFile } from "child_process"
import path from "path"
import os from "os"

const MAX_BODY_SIZE = 200_000 // 200 KB is plenty for LaTeX resumes

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/compile") {
    res.writeHead(404)
    return res.end("Not Found")
  }

  let latex = ""
  let size = 0

  req.on("data", chunk => {
    size += chunk.length
    if (size > MAX_BODY_SIZE) {
      res.writeHead(413)
      res.end("LaTeX source too large")
      req.destroy()
      return
    }
    latex += chunk
  })

  req.on("end", async () => {
    let workDir

    try {
      // 1️⃣ Create writable working directory
      workDir = await fs.mkdtemp(path.join(os.tmpdir(), "latex-"))

      // 2️⃣ Write LaTeX file
      const texPath = path.join(workDir, "main.tex")
      await fs.writeFile(texPath, latex)

      // 3️⃣ Prepare cache (MANDATORY)
      const cacheDir = path.join(os.tmpdir(), "tectonic-cache")
      await fs.mkdir(cacheDir, { recursive: true })

      // 4️⃣ Run Tectonic EXACTLY like your successful test
      execFile(
        "tectonic",
        ["main.tex"],
        {
          cwd: workDir,          // 🔑 writable
          timeout: 20000,
          env: {
            HOME: workDir,       // 🔑 critical
            XDG_CACHE_HOME: cacheDir,
            TECTONIC_CACHE_DIR: cacheDir,
            PATH: process.env.PATH,
          },
        },
        async (err) => {
          try {
            if (err) {
              res.writeHead(400)
              return res.end(err.message)
            }

            const pdf = await fs.readFile(path.join(workDir, "main.pdf"))
            res.writeHead(200, { "Content-Type": "application/pdf" })
            res.end(pdf)
          } finally {
            // 5️⃣ Always clean up
            await fs.rm(workDir, { recursive: true, force: true })
          }
        }
      )
    } catch (e) {
      if (workDir) {
        await fs.rm(workDir, { recursive: true, force: true })
      }
      res.writeHead(500)
      res.end("Compilation failed")
    }
  })
})

server.listen(8080, () => {
  console.log("✅ LaTeX sandbox listening on :8080")
})