"use client";

export default function ContactAdminPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">📞 연락처 관리</h1>
        <p className="text-gray-600 mb-4">
          교회 연락처를 관리합니다. (contact kind 섹션 사용)
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-gray-700">
          이 기능은 기존 섹션 관리 페이지(/admin/sections)에서 사용하거나,
          contact kind 섹션을 통해 관리할 수 있습니다.
        </p>
      </div>
    </div>
  );
}


