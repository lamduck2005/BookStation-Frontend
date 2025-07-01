<template>
  <div class="gray-bg">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-12 col-lg-10">
          <div class="product-box">
            <div class="row">
              <div class="col-md-6 product-image-col">
                <div class="mx-2 my-3">
                  <img
                    src="https://cdn1.fahasa.com/media/catalog/product/b/_/b_a-1_2_25.jpg"
                    alt="Product Image"
                    class="img-fluid mx-auto d-block"
                  />
                  <div class="row mt-4 g-2">
                    <div class="col-6">
                      <button
                        class="btn btn-outline-danger btn-lg w-100 fw-bold add-cart-btn"
                      >
                        <i class="fa fa-shopping-cart me-2"></i>
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                    <div class="col-6">
                      <button
                        class="btn btn-danger btn-lg w-100 fw-bold buy-now-btn"
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="info-box p-4">
                  <h3>Global Success - Tiếng Anh 5 - Sách Bài Tập (2024)</h3>

                  <div class="row">
                    <div class="col-6"><p>Tác giả: Hoàng Văn Vân</p></div>
                    <div class="col-6">
                      <p>Nhà xuất bản: Giáo Dục Việt Nam</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6"><p>Năm xuất bản: 2024</p></div>
                    <div class="col-6"><p>Nhà cung cấp: Cty Phương Nam</p></div>
                  </div>
                  <div class="product-meta mb-3">
                    <span class="star-rating"> ⭐⭐⭐⭐⭐ </span>
                    <span class="review-count text-warning ms-2"
                      >(0 đánh giá)</span
                    >
                    <span class="sold-count text-secondary ms-3"
                      >| Đã bán 373</span
                    >
                  </div>
                  <div class="product-price mb-3">
                    <span
                      class="price text-danger fw-bold"
                      style="font-size: 2rem"
                      >65.000 đ</span
                    >
                  </div>
                </div>
                <!-- Mô tả sản phẩm -->
                <div class="description-box mt-4">
                  <h4 class="fw-bold mb-3">Mô tả sản phẩm</h4>
                  <div>
                    <b>50 Đề Minh Họa Tốt Nghiệp THPT 2025 - Môn Vật Lí</b>
                    <ul>
                      <li>
                        Bản luyện đề trắc nghiệm 2025 theo định dạng mới nhất
                        của bộ Giáo Dục.
                      </li>
                      <li>
                        Các câu hỏi được thiết kế theo định hướng đánh giá năng
                        lực, gắn với bối cảnh có giá trị nhất định về thực tiễn
                        và khoa học, phù hợp với chương trình giáo dục mới.
                      </li>
                      <li>
                        Xây dựng và phát triển mở rộng ma trận cấu trúc đề thi
                        minh họa năm 2025 của Bộ Giáo dục
                      </li>
                      <li>
                        100% bài tập có lời giải chi tiết, video hướng dẫn từng
                        ID và livestream đầy đủ 50 đề
                      </li>
                    </ul>
                    <b>*** Về nội dung:</b>
                    <ul>
                      <li>
                        Mỗi đề đều gồm 50 câu hỏi được phân bố theo các mức độ
                        từ nhận biết, thông hiểu đến vận dụng, vận dụng cao.
                      </li>
                      <li>
                        Với các câu ở mức độ thông hiểu: tác giả cài cắm nhiều
                        câu bẫy, dễ mắc sai lầm, đòi hỏi các em không chỉ nắm
                        chắc lí thuyết mà còn phải hết sức cẩn thận, tỉnh táo,
                        không chủ quan mới có thể chọn đúng.
                      </li>
                      <li>
                        Với các câu ở mức độ vận dụng và đặc biệt là vận dụng
                        cao: tác giả đã cố gắng sáng tạo thêm để các em chủ động
                        xử lí bài tập HAY - LẠ - KHÓ từ nhiều hướng khác nhau.
                      </li>
                    </ul>
                    <b>*** Đối tượng sử dụng:</b>
                    <ul>
                      <li>
                        Học sinh lớp 12 chuẩn bị ôn thi cho kì thi tốt nghiệp
                        TNPT 2025, ôn thi đánh giá năng lực.
                      </li>
                      <li>Học sinh lớp 11 muốn luyện đề thi TNPT sớm.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped>
.product-box {
  padding-top: 2.5rem !important;
}
.product-image-col {
  min-width: 380px;
  min-height: 520px;
  border-radius: 18px;
  background: #fff;
  display: block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0px;
}
.info-box {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.container {
  max-width: 100% !important;
  width: 100% !important;
  margin: 0 auto;
  /* padding-left: 30px;
  padding-right: 30px; */
}
.gray-bg {
  min-height: 100vh;
  background: #f0f0f0;
}
.add-cart-btn,
.buy-now-btn {
  height: 50px;
  font-size: 1.3rem;
  padding: 0.5rem 1.5rem;
}
.add-cart-btn i {
  font-size: 1.2rem;
}
.add-cart-btn {
  margin-right: 8px;
  border: 2px solid #d32f2f;
  color: #d32f2f;
  background: #fff;
  transition: background 0.2s, color 0.2s;
}
.add-cart-btn:hover {
  background: #d32f2f;
  color: #fff;
}

.buy-now-btn {
  background: #d32f2f;
  color: #fff;
  border: 2px solid #d32f2f;
  transition: background 0.2s, color 0.2s;
}
.buy-now-btn:hover {
  background: #fff;
  color: #d32f2f;
}
.description-box {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  font-size: 1.08rem;
  margin-bottom: 2rem;
}
</style>
