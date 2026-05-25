// ================================================================
// Supabase 설정 및 클라이언트 초기화
// ================================================================

// Supabase 프로젝트 설정
const SUPABASE_URL = 'https://fkqxalcwhqohrkdzwhvv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5sLcyIwutRptBow_Xe7MpA_IDKtDwXI';

// Supabase 클라이언트 생성
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================================================================
// 유틸리티 함수
// ================================================================

/**
 * 에러 처리 헬퍼
 */
function handleError(error, context = '') {
    console.error(`[${context}] Error:`, error);
    return null;
}

/**
 * 로딩 표시
 */
function showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = '<div class="text-center py-20"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div></div>';
    }
}

/**
 * 날짜 포맷팅
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ================================================================
// API 함수들
// ================================================================

/**
 * 히어로 섹션 데이터 가져오기
 */
async function fetchHeroSection() {
    try {
        const { data, error } = await supabase
            .from('hero_section')
            .select('*')
            .eq('is_active', true)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchHeroSection');
    }
}

/**
 * 소개 섹션 데이터 가져오기
 */
async function fetchAboutSection() {
    try {
        const { data, error } = await supabase
            .from('about_section')
            .select('*')
            .eq('is_active', true)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchAboutSection');
    }
}

/**
 * 대형 문구들 가져오기
 */
async function fetchLargeStatements() {
    try {
        const { data, error } = await supabase
            .from('large_statements')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchLargeStatements');
    }
}

/**
 * 예배 카드들 가져오기
 */
async function fetchServiceCards() {
    try {
        const { data, error } = await supabase
            .from('service_cards')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchServiceCards');
    }
}

/**
 * 간증 카드들 가져오기
 */
async function fetchTestimonialCards() {
    try {
        const { data, error } = await supabase
            .from('testimonial_cards')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchTestimonialCards');
    }
}

/**
 * 프로그램 카드들 가져오기
 */
async function fetchProgramCards() {
    try {
        const { data, error } = await supabase
            .from('program_cards')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchProgramCards');
    }
}

/**
 * 통계 항목들 가져오기
 */
async function fetchStatsItems() {
    try {
        const { data, error } = await supabase
            .from('stats_items')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchStatsItems');
    }
}

/**
 * 특징 섹션 가져오기
 */
async function fetchFeaturesSection() {
    try {
        const { data, error } = await supabase
            .from('features_section')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchFeaturesSection');
    }
}

/**
 * 특징 이미지들 가져오기
 */
async function fetchFeaturesImages() {
    try {
        const { data, error } = await supabase
            .from('features_images')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchFeaturesImages');
    }
}

/**
 * 사이트 설정 가져오기
 */
async function fetchSiteSettings() {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchSiteSettings');
    }
}

/**
 * 주보 목록 가져오기
 */
async function fetchWeeklyBulletins(limit = 10) {
    try {
        const { data, error } = await supabase
            .from('weekly_bulletins')
            .select('*')
            .eq('is_active', true)
            .order('bulletin_date', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchWeeklyBulletins');
    }
}

/**
 * 새가족 등록
 */
async function registerVisitor(visitorData) {
    try {
        const { data, error } = await supabase
            .from('visitor_registrations')
            .insert([visitorData])
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'registerVisitor');
    }
}

/**
 * 게시판 글 목록 가져오기
 */
async function fetchBoardPosts(category = null, limit = 20) {
    try {
        let query = supabase
            .from('board_posts')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (category) {
            query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchBoardPosts');
    }
}

/**
 * 게시판 글 상세 가져오기
 */
async function fetchBoardPost(postId) {
    try {
        // 조회수 증가
        const { error: updateError } = await supabase
            .rpc('increment_view_count', { post_id: postId });
        
        // 글 가져오기
        const { data, error } = await supabase
            .from('board_posts')
            .select('*')
            .eq('id', postId)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchBoardPost');
    }
}

/**
 * 게시판 댓글 가져오기
 */
async function fetchBoardComments(postId) {
    try {
        const { data, error } = await supabase
            .from('board_comments')
            .select('*')
            .eq('post_id', postId)
            .eq('is_active', true)
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, 'fetchBoardComments');
    }
}

// ================================================================
// 조회수 증가 함수 (Supabase에서 함수 생성 필요)
// ================================================================
/*
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE board_posts 
    SET view_count = view_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

// ================================================================
// 내보내기
// ================================================================
window.BucheonChurchAPI = {
    supabase,
    fetchHeroSection,
    fetchAboutSection,
    fetchLargeStatements,
    fetchServiceCards,
    fetchTestimonialCards,
    fetchProgramCards,
    fetchStatsItems,
    fetchFeaturesSection,
    fetchFeaturesImages,
    fetchSiteSettings,
    fetchWeeklyBulletins,
    registerVisitor,
    fetchBoardPosts,
    fetchBoardPost,
    fetchBoardComments,
    formatDate,
    showLoading
};

console.log('✅ Supabase 설정 완료');
console.log('📝 API 함수 사용 가능: window.BucheonChurchAPI');

