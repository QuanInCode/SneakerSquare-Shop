const URL_API = `http://localhost:3000`;

// Định nghĩa kiểu dữ liệu cho loại sản phẩm
type TLoaiSP = {
    id: number;
    ten_loai: string;
    thu_tu: number;
};

// Định nghĩa giao diện cho sản phẩm
interface ISan_Pham {
    id: number;
    ten_sp: string;
    gia: number;
    gia_km: number;
    hinh: string;
    ngay: string;
    luot_xem: number;
    mo_ta?: string; // Mô tả sản phẩm tùy chọn
}

// Hàm lấy danh sách loại sản phẩm
const lay_loai = async (): Promise<string> => {
    try {
        const loai_arr: TLoaiSP[] = await fetch(`${URL_API}/loai`).then(res => res.json());
        let str: string = `<li><a href="index.html">Trang chủ</a></li>`;

        // Thêm phần "Loại" chứa các hãng giày
        str += `<li><a href="#">Loại</a><ul>`;
        loai_arr.filter(loai => ['2', '3', '4', '5'].includes(loai.id.toString())).forEach(loai => {
            str += `<li><a href="sptrongloai.html?id=${loai.id}">${loai.ten_loai}</a></li>`;
        });
        str += `</ul></li>`;

        // Thêm phần "Phụ kiện"
        str += `<li><a href="#">Phụ kiện</a><ul>`;
        loai_arr.filter(loai => ['7', '8', '9'].includes(loai.id.toString())).forEach(loai => {
            str += `<li><a href="sptrongloai.html?id=${loai.id}">${loai.ten_loai}</a></li>`;
        });
        str += `</ul></li>`;

        return `<ul>${str}</ul>`;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
        return `<ul><li>Lỗi khi tải danh sách loại sản phẩm</li></ul>`;
    }
};

// Hàm lấy tên loại sản phẩm theo ID
const lay_ten_loai = async (id: number): Promise<string> => {
    try {
        const loai: TLoaiSP = await fetch(`${URL_API}/loai/${id}`).then(res => res.json());
        return loai.ten_loai;
    } catch (err) {
        console.error(`Lỗi khi lấy loại sản phẩm với ID ${id}:`, err);
        return `Không có loại ${id}`;
    }
};

// Hàm tạo mã HTML cho một sản phẩm với liên kết đến trang chi tiết sản phẩm
const code_mot_sp = (sp: ISan_Pham): string => {
    return `
    <div class="sp ">
        <a href="shop-detail.html?id=${sp.id}"><h3>${sp.ten_sp}</h3>
        <img src="${sp.hinh}" alt="${sp.ten_sp}">
        <p>Giá gốc: ${Number(sp.gia).toLocaleString("vi")} VND</p>
        <p class="giakm">Khuyến mãi: ${Number(sp.gia_km).toLocaleString("vi")} VND</p>
        </a>
    </div>`;
};

// Hàm lấy danh sách sản phẩm mới
const lay_sp_moi = async (so_sp: number = 6): Promise<string> => {
    try {
        const url = `${URL_API}/san_pham?_sort=-ngay&_limit=${so_sp}`;
        const sp_arr: ISan_Pham[] = await fetch(url).then(res => res.json());
        return sp_arr.map(sp => code_mot_sp(sp)).join('');
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm mới:", error);
        return '';
    }
};

// Hàm lấy danh sách sản phẩm hot
const lay_sp_hot = async (so_sp: number = 6): Promise<string> => {
    try {
        const url = `${URL_API}/san_pham?hot=1&_limit=${so_sp}`;
        const sp_arr: ISan_Pham[] = await fetch(url).then(res => res.json());
        return sp_arr.map(sp => code_mot_sp(sp)).join('');
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm hot:", error);
        return '';
    }
};

// Hàm lấy danh sách sản phẩm theo loại
const lay_sp_trong_loai = async (id: number): Promise<string> => {
    try {
        const url = `${URL_API}/san_pham?id_loai=${id}`;
        const sp_arr: ISan_Pham[] = await fetch(url).then(res => res.json());
        return sp_arr.map(sp => code_mot_sp(sp)).join('');
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách sản phẩm trong loại ${id}:`, error);
        return '';
    }
};

// Hàm lấy sản phẩm theo ID
const lay_sp_theo_id = async (id: number): Promise<ISan_Pham | null> => {
    try {
        const sp: ISan_Pham = await fetch(`${URL_API}/san_pham/${id}`).then(res => res.json());
        return sp;
    } catch (err) {
        console.error(`Lỗi khi lấy sản phẩm với ID ${id}:`, err);
        return null;
    }
};

// Hàm hiển thị chi tiết sản phẩm
const hien_thi_chi_tiet_sp = async (): Promise<void> => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (!productId) {
        console.error('Không tìm thấy ID sản phẩm trong URL');
        return;
    }

    const product = await lay_sp_theo_id(Number(productId));
    if (!product) {
        console.error('Không thể tìm thấy sản phẩm');
        return;
    }

    // Hiển thị chi tiết sản phẩm
    document.querySelector(".detail-row")!.innerHTML = `
        <div class="col-md-6">
            <img src="${product.hinh}" class="img-fluid img" style="height: auto; max-width: 100%;" alt="${product.ten_sp}" />
        </div>
        <div class="col-md-6">
            <h2>${product.ten_sp}</h2>
            <p>${product.mo_ta || ''}</p>

            <p class="h3 giagoc" >Giá gốc: ${Number(product.gia).toLocaleString("vi")} VND</p>
            <p class="h4 giakm">Giá khuyến mãi: ${Number(product.gia_km).toLocaleString("vi")} VND</p>
        </div>
    `;
};

// Xuất các hàm để sử dụng ở nơi khác
export { 
    lay_loai, 
    lay_sp_moi, 
    lay_sp_hot, 
    code_mot_sp, 
    lay_sp_trong_loai, 
    lay_ten_loai, 
    lay_sp_theo_id, 
    hien_thi_chi_tiet_sp 
};
