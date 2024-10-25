const URL_API = `http://localhost:3000`;
const lay_loai = async () => {
    try {
        const loai_arr = await fetch(`${URL_API}/loai`).then(res => res.json());
        let str = `<li><a href="index.html">Trang chủ</a></li>`;
        str += `<li><a href="#">Loại</a><ul>`;
        loai_arr.filter(loai => ['2', '3', '4', '5'].includes(loai.id.toString())).forEach(loai => {
            str += `<li><a href="sptrongloai.html?id=${loai.id}">${loai.ten_loai}</a></li>`;
        });
        str += `</ul></li>`;
        str += `<li><a href="#">Phụ kiện</a><ul>`;
        loai_arr.filter(loai => ['7', '8', '9'].includes(loai.id.toString())).forEach(loai => {
            str += `<li><a href="sptrongloai.html?id=${loai.id}">${loai.ten_loai}</a></li>`;
        });
        str += `</ul></li>`;
        return `<ul>${str}</ul>`;
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
        return `<ul><li>Lỗi khi tải danh sách loại sản phẩm</li></ul>`;
    }
};
const lay_ten_loai = async (id) => {
    try {
        const loai = await fetch(`${URL_API}/loai/${id}`).then(res => res.json());
        return loai.ten_loai;
    }
    catch (err) {
        console.error(`Lỗi khi lấy loại sản phẩm với ID ${id}:`, err);
        return `Không có loại ${id}`;
    }
};
const code_mot_sp = (sp) => {
    return `
    <div class="sp ">
        <a href="shop-detail.html?id=${sp.id}"><h3>${sp.ten_sp}</h3>
        <img src="${sp.hinh}" alt="${sp.ten_sp}">
        <p>Giá gốc: ${Number(sp.gia).toLocaleString("vi")} VND</p>
        <p class="giakm">Khuyến mãi: ${Number(sp.gia_km).toLocaleString("vi")} VND</p>
        </a>
    </div>`;
};
const lay_sp_moi = async (so_sp = 6) => {
    try {
        const url = `${URL_API}/san_pham?_sort=-ngay&_limit=${so_sp}`;
        const sp_arr = await fetch(url).then(res => res.json());
        return sp_arr.map(sp => code_mot_sp(sp)).join('');
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm mới:", error);
        return '';
    }
};
const lay_sp_hot = async (so_sp = 6) => {
    try {
        const url = `${URL_API}/san_pham?hot=1&_limit=${so_sp}`;
        const sp_arr = await fetch(url).then(res => res.json());
        return sp_arr.map(sp => code_mot_sp(sp)).join('');
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm hot:", error);
        return '';
    }
};
const lay_sp_trong_loai = async (id) => {
    try {
        const url = `${URL_API}/san_pham?id_loai=${id}`;
        const sp_arr = await fetch(url).then(res => res.json());
        return sp_arr.map(sp => code_mot_sp(sp)).join('');
    }
    catch (error) {
        console.error(`Lỗi khi lấy danh sách sản phẩm trong loại ${id}:`, error);
        return '';
    }
};
const lay_sp_theo_id = async (id) => {
    try {
        const sp = await fetch(`${URL_API}/san_pham/${id}`).then(res => res.json());
        return sp;
    }
    catch (err) {
        console.error(`Lỗi khi lấy sản phẩm với ID ${id}:`, err);
        return null;
    }
};
const hien_thi_chi_tiet_sp = async () => {
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
    document.querySelector(".detail-row").innerHTML = `
        <div class="col-md-6">
            <img src="${product.hinh}" class="img-fluid img" style="height: auto; max-width: 100%;" alt="${product.ten_sp}" />
        </div>
        <div class="col-md-6">
            <h2>${product.ten_sp}</h2>
           
            <p class="mb-4">${product.mo_ta || ''}</p>
            
            <p class="h3 giagoc " >Giá gốc: ${Number(product.gia).toLocaleString("vi")} VND</p>
             <p class="h4 giakm">Giá khuyến mãi: ${Number(product.gia_km).toLocaleString("vi")} VND</p>
        </div>
    `;
};
export { lay_loai, lay_sp_moi, lay_sp_hot, code_mot_sp, lay_sp_trong_loai, lay_ten_loai, lay_sp_theo_id, hien_thi_chi_tiet_sp };
