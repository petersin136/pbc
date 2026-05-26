/* ================================================================
   admin/admin-header.js
   - 메인 사이트와 동일한 헤더(로고 + 네비게이션 드롭다운 + 햄버거)를
     모든 관리자 페이지에 동일하게 주입한다.
   - 네비게이션 메뉴 항목은 메인 사이트(`../index.html#section`)로 연결.
   - 헤더 바로 아래에는 관리자 전용 sub-header(페이지 제목 + 사이트 보기 + 로그아웃)를 함께 둠.

   사용법:
     <link rel="stylesheet" href="./admin-header.css">
     <script src="./admin-header.js" defer></script>
     <script>
       document.addEventListener('DOMContentLoaded', () => {
         renderAdminHeader({
           pageTitle: '콘텐츠 관리',          // sub-header 좌측 제목
           backHref: './index.html',          // ← 대시보드 링크 (없으면 표시 안함)
           showBack: true,
           showAdminName: true,               // sessionStorage에서 이름 자동 표시
           showLogout: true                   // 로그아웃 버튼 표시 (login.html 로 이동)
         });
       });
     </script>
   ================================================================ */

(function () {
    const NAV_BASE = '../index.html';

    /**
     * 헤더 HTML 생성
     */
    function buildHeaderHTML() {
        return `
        <header class="fixed top-0 left-0 w-full z-50 main-header">
            <div class="max-w-7xl mx-auto px-4 md:px-8 py-2 flex justify-between items-center">
                <!-- 좌측: 로고 + 교회명 -->
                <div class="flex items-center gap-2 md:gap-3">
                    <img src="https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/pbclo-Photoroom.png"
                         alt="포천중앙침례교회 로고"
                         class="header-logo">
                    <div class="denomination" style="font-size: 0.85em;">
                        <div class="denomination-top">기독교</div>
                        <div class="denomination-bottom">한국침례회</div>
                    </div>
                    <a href="${NAV_BASE}#heroSection" class="church-name flex items-center" style="text-decoration: none; cursor: pointer;">
                        <span class="text-xs md:text-sm" style="font-family: 'Noto Sans KR', sans-serif; font-weight: 400; color: #FFB800;">오직예수! 오직전도!</span>
                        <span class="text-base md:text-xl font-bold ml-2" style="color: white;">포천중앙침례교회</span>
                    </a>
                </div>

                <!-- 우측: 네비게이션 + 영문 교회명 + 햄버거 -->
                <div class="flex items-center gap-3 md:gap-6">
                    <nav class="desktop-nav hidden md:flex gap-3 lg:gap-4 text-white font-medium text-xs md:text-sm items-center">

                        <div class="nav-dropdown relative">
                            <button class="nav-dropdown-btn flex items-center gap-1 hover:text-red-400 transition"
                                    onclick="toggleDropdown(event, 'admin-church-menu')">
                                교회 소개
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 4.5l3 3 3-3"/>
                                </svg>
                            </button>
                            <div id="admin-church-menu" class="nav-dropdown-menu">
                                <a href="${NAV_BASE}#about" class="dropdown-item">교회 소개</a>
                                <a href="${NAV_BASE}#pastor" class="dropdown-item">담임목사</a>
                            </div>
                        </div>

                        <div class="nav-dropdown relative">
                            <button class="nav-dropdown-btn flex items-center gap-1 hover:text-red-400 transition"
                                    onclick="toggleDropdown(event, 'admin-worship-menu')">
                                예배/설교
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 4.5l3 3 3-3"/>
                                </svg>
                            </button>
                            <div id="admin-worship-menu" class="nav-dropdown-menu">
                                <a href="${NAV_BASE}#sermon" class="dropdown-item">설교 영상</a>
                                <a href="${NAV_BASE}#worship-times" class="dropdown-item">예배시간</a>
                                <a href="${NAV_BASE}#vision" class="dropdown-item">교회 핵심 가치</a>
                            </div>
                        </div>

                        <div class="nav-dropdown relative">
                            <button class="nav-dropdown-btn flex items-center gap-1 hover:text-red-400 transition"
                                    onclick="toggleDropdown(event, 'admin-community-menu')">
                                공동체
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 4.5l3 3 3-3"/>
                                </svg>
                            </button>
                            <div id="admin-community-menu" class="nav-dropdown-menu">
                                <a href="${NAV_BASE}#testimonials" class="dropdown-item">간증</a>
                                <a href="${NAV_BASE}#features" class="dropdown-item">초대합니다</a>
                            </div>
                        </div>

                        <div class="nav-dropdown relative">
                            <button class="nav-dropdown-btn flex items-center gap-1 hover:text-red-400 transition"
                                    onclick="toggleDropdown(event, 'admin-info-menu')">
                                소식
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 4.5l3 3 3-3"/>
                                </svg>
                            </button>
                            <div id="admin-info-menu" class="nav-dropdown-menu">
                                <a href="${NAV_BASE}#notice" class="dropdown-item">공지사항</a>
                                <a href="${NAV_BASE}#prayer" class="dropdown-item">기도제목</a>
                                <a href="${NAV_BASE}#gallery" class="dropdown-item">갤러리</a>
                            </div>
                        </div>

                        <a href="${NAV_BASE}#location" class="hover:text-red-400 transition">오시는 길</a>

                        <div class="nav-dropdown relative">
                            <button class="nav-dropdown-btn flex items-center gap-1 hover:text-red-400 transition"
                                    onclick="toggleDropdown(event, 'admin-external-sites-menu')">
                                바로가기
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 4.5l3 3 3-3"/>
                                </svg>
                            </button>
                            <div id="admin-external-sites-menu" class="nav-dropdown-menu" style="right: 0; left: auto;">
                                <a href="https://history.kbtus.ac.kr/history/CMS/Contents/Contents.do?mCode=MN025" target="_blank" rel="noopener noreferrer" class="dropdown-item">한국침례교회 발자취</a>
                                <a href="https://www.koreabaptist.or.kr/" target="_blank" rel="noopener noreferrer" class="dropdown-item">기독교한국침례회 총회</a>
                                <a href="https://www.baptistnews.co.kr/" target="_blank" rel="noopener noreferrer" class="dropdown-item">침례신문</a>
                            </div>
                        </div>
                    </nav>

                    <div class="hidden md:block text-right">
                        <div class="text-white font-semibold text-sm" style="font-family: 'Playfair Display', serif;">Pocheon Central Baptist Church</div>
                    </div>

                    <button id="mobile-menu-toggle"
                            class="md:hidden flex items-center justify-center"
                            style="width: 32px; height: 32px; padding: 6px; background-color: rgba(255, 255, 255, 0.1); border-radius: 8px; transition: all 0.3s ease; border: none; cursor: pointer; backdrop-filter: blur(5px);"
                            onclick="toggleAdminMobileMenu()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <!-- 모바일 햄버거 메뉴 -->
        <div id="mobile-menu">
            <nav>
                <div class="mobile-nav-item" onclick="toggleAdminMobileSubmenu('admin-mobile-church-menu')">
                    교회 소개 <span style="float: right;">▼</span>
                </div>
                <div id="admin-mobile-church-menu" class="mobile-nav-dropdown" style="display: none;">
                    <a href="${NAV_BASE}#about">교회 소개</a>
                    <a href="${NAV_BASE}#pastor">담임목사</a>
                </div>

                <div class="mobile-nav-item" onclick="toggleAdminMobileSubmenu('admin-mobile-worship-menu')">
                    예배/설교 <span style="float: right;">▼</span>
                </div>
                <div id="admin-mobile-worship-menu" class="mobile-nav-dropdown" style="display: none;">
                    <a href="${NAV_BASE}#sermon">설교 영상</a>
                    <a href="${NAV_BASE}#worship-times">예배시간</a>
                    <a href="${NAV_BASE}#vision">교회 핵심 가치</a>
                </div>

                <div class="mobile-nav-item" onclick="toggleAdminMobileSubmenu('admin-mobile-community-menu')">
                    공동체 <span style="float: right;">▼</span>
                </div>
                <div id="admin-mobile-community-menu" class="mobile-nav-dropdown" style="display: none;">
                    <a href="${NAV_BASE}#testimonials">간증</a>
                    <a href="${NAV_BASE}#features">초대합니다</a>
                </div>

                <div class="mobile-nav-item" onclick="toggleAdminMobileSubmenu('admin-mobile-info-menu')">
                    소식 <span style="float: right;">▼</span>
                </div>
                <div id="admin-mobile-info-menu" class="mobile-nav-dropdown" style="display: none;">
                    <a href="${NAV_BASE}#notice">공지사항</a>
                    <a href="${NAV_BASE}#prayer">기도제목</a>
                    <a href="${NAV_BASE}#gallery">갤러리</a>
                </div>

                <a href="${NAV_BASE}#location" class="mobile-nav-item">오시는 길</a>

                <div class="mobile-nav-item" onclick="toggleAdminMobileSubmenu('admin-mobile-external-sites-menu')">
                    바로가기 <span style="float: right;">▼</span>
                </div>
                <div id="admin-mobile-external-sites-menu" class="mobile-nav-dropdown" style="display: none;">
                    <a href="https://history.kbtus.ac.kr/history/CMS/Contents/Contents.do?mCode=MN025" target="_blank" rel="noopener noreferrer">한국침례교회 발자취</a>
                    <a href="https://www.koreabaptist.or.kr/" target="_blank" rel="noopener noreferrer">기독교한국침례회 총회</a>
                    <a href="https://www.baptistnews.co.kr/" target="_blank" rel="noopener noreferrer">침례신문</a>
                </div>
            </nav>
        </div>
        `;
    }

    /**
     * 관리자 sub-header HTML 생성
     */
    function buildSubHeaderHTML(options) {
        const {
            pageTitle = '관리자',
            backHref = './index.html',
            showBack = true,
            showAdminName = true,
            showViewSite = true,
            showLogout = true,
        } = options || {};

        const backHTML = showBack
            ? `<a href="${backHref}" class="back-link">← 대시보드</a>`
            : '';

        const adminNameHTML = showAdminName
            ? `<span id="adminHeaderName" class="admin-name"></span>`
            : '';

        const viewSiteHTML = showViewSite
            ? `<a href="${NAV_BASE}" target="_blank" class="view-site">사이트 보기 ↗</a>`
            : '';

        const logoutHTML = showLogout
            ? `<button id="adminHeaderLogout" class="logout-btn" type="button">로그아웃</button>`
            : '';

        return `
        <div class="admin-subheader">
            <div class="admin-subheader-inner">
                <div class="admin-subheader-left">
                    ${backHTML}
                    <h1 class="page-title">${pageTitle}</h1>
                </div>
                <div class="admin-subheader-right">
                    ${adminNameHTML}
                    ${viewSiteHTML}
                    ${logoutHTML}
                </div>
            </div>
        </div>
        `;
    }

    // ----------- 외부에 노출되는 함수들 -----------

    window.renderAdminHeader = function (options) {
        const headerHTML = buildHeaderHTML();
        const subHeaderHTML = buildSubHeaderHTML(options);

        const wrapper = document.createElement('div');
        wrapper.innerHTML = headerHTML + subHeaderHTML;

        document.body.classList.add('has-admin-header');
        document.body.insertBefore(wrapper, document.body.firstChild);

        if ((!options || options.showAdminName !== false)) {
            const nameEl = document.getElementById('adminHeaderName');
            if (nameEl) {
                const adminUser = sessionStorage.getItem('pcbc_admin_user') || '';
                nameEl.textContent = adminUser ? `${adminUser}님` : '';
            }
        }

        if ((!options || options.showLogout !== false)) {
            const logoutBtn = document.getElementById('adminHeaderLogout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    sessionStorage.removeItem('pcbc_admin_auth');
                    sessionStorage.removeItem('pcbc_admin_user');
                    window.location.href = './login.html';
                });
            }
        }
    };

    /** 데스크탑 드롭다운 토글 (메인 사이트와 동일한 동작) */
    window.toggleDropdown = function (event, menuId) {
        event.preventDefault();
        event.stopPropagation();

        const targetMenu = document.getElementById(menuId);
        if (!targetMenu) return;

        const isOpen = targetMenu.style.display === 'block';

        document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
        document.querySelectorAll('.nav-dropdown-btn svg').forEach(svg => {
            svg.style.transform = '';
        });

        if (!isOpen) {
            targetMenu.style.display = 'block';
            const btn = event.currentTarget.closest('.nav-dropdown-btn') || event.currentTarget;
            const svg = btn && btn.querySelector('svg');
            if (svg) svg.style.transform = 'rotate(180deg)';
        }
    };

    /** 외부 클릭 시 드롭다운 닫기 */
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
            document.querySelectorAll('.nav-dropdown-btn svg').forEach(svg => {
                svg.style.transform = '';
            });
        }
    });

    /** 모바일 햄버거 메뉴 토글 */
    window.toggleAdminMobileMenu = function () {
        const menu = document.getElementById('mobile-menu');
        if (!menu) return;
        menu.classList.toggle('active');
    };

    /** 모바일 서브메뉴 토글 */
    window.toggleAdminMobileSubmenu = function (menuId) {
        const sub = document.getElementById(menuId);
        if (!sub) return;
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    };

    /** ESC 키로 드롭다운 닫기 */
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
            document.querySelectorAll('.nav-dropdown-btn svg').forEach(svg => {
                svg.style.transform = '';
            });
            const mobile = document.getElementById('mobile-menu');
            if (mobile) mobile.classList.remove('active');
        }
    });
})();
