import "../styles/AboutSection.css";

export default function AboutSection() {
  return (
    <section className="aboutSection">
      <div className="aboutContainer">
        <div className="aboutHeader">
          <h2 className="aboutMainTitle">Về Chúng Tôi</h2>
          <div className="titleUnderline"></div>
          <p className="aboutMainDesc">
            MyPharma App được thiết kế với hy vọng cung cấp một công cụ đắc lực
            trong quản lý và vận hành tiệm thuốc.
          </p>
        </div>

        <div className="aboutContent">
          <div className="aboutLeft">
            <h3 className="sectionTitle">Hành trình phát triển</h3>
            <p className="sectionDesc">
              Từ những ngày đầu, phần mềm đã được không ngừng đổi mới và phát
              triển, luôn đặt chất lượng và sự hài lòng của khách hàng lên hàng
              đầu.
            </p>

            <ul className="featureList">
              {[
                "Đội ngũ chuyên gia có trình độ cao",
                "Công nghệ tiên tiến và hiện đại",
                "Giao diện thân thiện và dễ sử dụng",
                "Công cụ quản lý đầy mạnh mẽ",
              ].map((text, index) => (
                <li key={index} className="featureItem">
                  <span className="bulletPoint">•</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="aboutRightBox">
            <div className="visionItem">
              <h4 className="visionLabel">Tầm nhìn</h4>
              <p className="visionText">
                Trở thành phần mềm có mặt tại mọi đại lý thuốc.
              </p>
            </div>

            <div className="visionItem">
              <h4 className="visionLabel">Nhiệm vụ</h4>
              <p className="visionText">
                Cung cấp các giải pháp phần mềm chất lượng cao.
              </p>
            </div>

            <div className="visionItem">
              <h4 className="visionLabel">Cam kết</h4>
              <p className="visionText">
                Cam kết mang đến giải pháp tối ưu nhất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
