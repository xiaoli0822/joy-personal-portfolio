"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { message?: string }
        throw new Error(data.message || "登录失败")
      }

      toast.success("已进入后台")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登录失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.1)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70"
      >
        <div className="mb-8 space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Portfolio Admin
          </p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            输入口令进入管理后台
          </h1>
          <p className="text-sm leading-7 text-slate-500 dark:text-white/55">
            这里可以统一编辑个人信息、技能、项目和经历，并实时保存到本地内容源。
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-white/75">
              管理口令
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
              placeholder="请输入 ADMIN_PASSWORD"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900"
          >
            {loading ? "登录中..." : "进入后台"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
