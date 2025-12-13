"use client";

import Link from "next/link";

/**
 * 관리자 대시보드 - 홈
 */
export default function AdminDashboardPage() {
  const quickActions = [
    {
      icon: "🎬",
      title: "Hero 배너",
      description: "메인 페이지 상단 배너 관리",
      href: "/admin/hero",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "📢",
      title: "공지사항",
      description: "교회 공지사항 작성 및 관리",
      href: "/admin/announcements",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: "🙏",
      title: "기도제목",
      description: "주간 기도제목 관리",
      href: "/admin/prayer",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: "📸",
      title: "갤러리",
      description: "교회 활동 사진 업로드",
      href: "/admin/gallery",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const allSections = [
    { icon: "📋", label: "정보 카드", href: "/admin/content-cards" },
    { icon: "📝", label: "텍스트 섹션", href: "/admin/text-sections" },
    { icon: "🖼️", label: "이미지 섹션", href: "/admin/image-sections" },
    { icon: "👤", label: "팀 소개", href: "/admin/team" },
    { icon: "📍", label: "교회 위치", href: "/admin/location" },
    { icon: "📞", label: "연락처", href: "/admin/contact" },
    { icon: "🎓", label: "부서 안내", href: "/admin/departments" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* 환영 메시지 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          환영합니다! 👋
        </h1>
        <p className="text-gray-600">
          웹사이트 콘텐츠를 간편하게 관리하세요. 각 섹션을 클릭하여 시작하세요.
        </p>
      </div>

      {/* 빠른 액션 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">빠른 작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-200"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="relative">
                <div className="text-4xl mb-3">{action.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 모든 섹션 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">모든 섹션</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {allSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-300"
            >
              <span className="text-2xl">{section.icon}</span>
              <span className="text-sm font-medium text-gray-900">
                {section.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 도움말 */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>사용 팁</span>
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>각 섹션별로 독립된 관리 페이지가 있습니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>폼 입력으로 쉽게 콘텐츠를 추가하고 수정할 수 있습니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>드래그앤드롭으로 순서를 변경할 수 있습니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">4.</span>
            <span>저장하면 즉시 웹사이트에 반영됩니다.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
