"use client"

import { ArrowRight, BookOpen, Lock } from "lucide-react"
import { blogPosts } from "@/constants"
import { HomeIndicator } from "@/components/ios/home-indicator"

export function SafariApp() {
  return (
    <HomeIndicator>
      <div className="h-full w-full bg-[#f2f2f7] flex flex-col text-black">
        {/* Safari Top Bar */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 pt-12 pb-3 sticky top-0 z-10">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 justify-center max-w-md mx-auto">
            <Lock className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium select-none truncate">
              swastiksharma15.github.io/blogs
            </span>
          </div>
        </div>

        {/* Scrollable Blog Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-2xl font-bold tracking-tight mb-1 text-gray-900 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[#FF9500]" />
              My Developer Blogs
            </h1>
            <p className="text-xs text-gray-500 mb-6">
              Insights, tutorials, and articles about modern frontend engineering.
            </p>

            <div className="flex flex-col gap-4">
              {blogPosts.map(({ id, image, title, date, link }) => (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-gray-200/50 p-3 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
                >
                  {/* Blog Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg border border-gray-100">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Blog Content */}
                  <div className="flex-1 flex flex-col justify-between min-h-[80px]">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        {date}
                      </span>
                      <h3 className="font-semibold text-gray-800 text-xs leading-snug line-clamp-2">
                        {title}
                      </h3>
                    </div>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-0.5 mt-2 self-start"
                    >
                      <span>Read post</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HomeIndicator>
  )
}
