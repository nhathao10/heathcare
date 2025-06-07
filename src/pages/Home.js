import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Card, Tabs, Tab } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Home.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom"; // ✅ Thêm dòng này
import Chatbot from "./Chatbot";
import { FaRobot } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate(); // ✅ Dòng mới: khởi tạo điều hướng

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Tin tức y tế động
  const [news, setNews] = useState([]);
  const [newsError, setNewsError] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/vnexpress-health-news")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNews(data);
        } else {
          setNewsError(true);
        }
      })
      .catch(() => setNewsError(true));
  }, []);

  // Hàm lấy link ảnh đầu tiên từ description
  function extractImageFromDescription(desc) {
    if (!desc) return null;
    const match = desc.match(/<img[^>]+src=["']([^"'>]+)["']/i);
    return match ? match[1] : null;
  }

  const newsSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // State cho BMI
  const [bmiHeight, setBmiHeight] = useState("");
  const [bmiWeight, setBmiWeight] = useState("");
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiMsg, setBmiMsg] = useState("");

  function calcBMI(e) {
    e.preventDefault();
    const h = parseFloat(bmiHeight) / 100;
    const w = parseFloat(bmiWeight);
    if (!h || !w || h <= 0 || w <= 0) {
      setBmiResult(null);
      setBmiMsg("Vui lòng nhập đúng chiều cao và cân nặng!");
      return;
    }
    const bmi = w / (h * h);
    setBmiResult(bmi.toFixed(1));
    let msg = "";
    if (bmi < 18.5) msg = "Thiếu cân";
    else if (bmi < 23) msg = "Bình thường";
    else if (bmi < 25) msg = "Thừa cân";
    else msg = "Béo phì";
    setBmiMsg(msg);
  }

  function FloatingChatbot() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          className="floating-chatbot-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label="Chatbot hỗ trợ"
        >
          <FaRobot />
        </button>
        {open && (
          <div className="floating-chatbot-popup">
            <button className="close-chatbot-btn" onClick={() => setOpen(false)}>&times;</button>
            <Chatbot />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="home-wrapper">
      {/* Header */}
      <header className="header-gradient text-white text-center py-5 shadow">
        <h1 className="display-4 fw-bold" data-aos="fade-down">
          Trung tâm Y tế Cộng Đồng
        </h1>
        <p className="lead" data-aos="fade-up">
          Chăm sóc sức khỏe cộng đồng – Vì một tương lai khỏe mạnh
        </p>
        <Button
          className="glow-button mt-3 cta-btn"
          onClick={() => navigate("/dat-lich")}
        >
          Đặt lịch khám
        </Button>
      </header>

      {/* Giới thiệu */}
      <Container className="my-5">
        <Row className="align-items-center">
          <Col md={6} data-aos="zoom-in">
            <img
              src="/images.jpg"
              alt="Healthcare"
              className="img-fluid rounded-4 shadow-lg intro-image"
            />
          </Col>
          <Col md={6} data-aos="fade-left">
            <h2 className="text-gradient mb-3">Về Chúng Tôi</h2>
            <p>
              Chúng tôi cung cấp dịch vụ y tế hiện đại, thân thiện, chất lượng
              cao và dễ tiếp cận cho mọi người. Với đội ngũ bác sĩ giàu kinh
              nghiệm và trang thiết bị tiên tiến, trung tâm luôn đặt sức khỏe
              của bạn lên hàng đầu.
            </p>
            <ul>
              <li>Trang thiết bị hiện đại</li>
              <li>Đội ngũ bác sĩ chuyên môn cao</li>
              <li>Dịch vụ nhanh chóng – an toàn – hiệu quả</li>
            </ul>
            <Button className="glow-button mt-3">Tìm hiểu thêm</Button>
          </Col>
        </Row>
      </Container>

      {/* Dịch vụ nổi bật */}
      <Container className="my-5">
        <h2 className="text-center text-gradient mb-5" data-aos="fade-up">
          Dịch vụ nổi bật
        </h2>
        <Row>
          {[
            {
              title: "Khám tổng quát",
              img: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
              desc: "Chẩn đoán tổng thể – phát hiện sớm các bệnh lý thường gặp.",
            },
            {
              title: "Tiêm chủng",
              img: "https://cdn-icons-png.flaticon.com/512/2906/2906277.png",
              desc: "Tiêm vắc-xin cho mọi lứa tuổi – an toàn, chuẩn quy trình.",
            },
            {
              title: "Tư vấn sức khỏe",
              img: "https://cdn-icons-png.flaticon.com/512/3875/3875431.png",
              desc: "Hướng dẫn phòng bệnh và hỗ trợ tâm lý, dinh dưỡng.",
            },
            {
              title: "Xét nghiệm",
              img: "https://cdn-icons-png.flaticon.com/512/3275/3275643.png",
              desc: "Đa dạng các loại xét nghiệm – chính xác, nhanh chóng.",
            },
            {
              title: "Cấp cứu & sơ cứu",
              img: "https://cdn-icons-png.flaticon.com/512/6126/6126636.png",
              desc: "Hỗ trợ kịp thời các tình huống khẩn cấp trong cộng đồng.",
            },
            {
              title: "Khám tại nhà",
              img: "https://cdn-icons-png.flaticon.com/512/1828/1828919.png",
              desc: "Dịch vụ tận nơi dành cho người cao tuổi hoặc khó di chuyển.",
            },
          ].map((service, index) => (
            <Col md={4} className="mb-4" key={index} data-aos="flip-left">
              <Card className="service-card h-100 text-center shadow-lg">
                <Card.Img
                  variant="top"
                  src={service.img}
                  className="service-img"
                />
                <Card.Body>
                  <Card.Title>{service.title}</Card.Title>
                  <Card.Text>{service.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Đội ngũ bác sĩ */}
      <Container className="my-5">
        <h2 className="text-center text-gradient mb-5" data-aos="fade-up">
          Đội ngũ bác sĩ
        </h2>
        <Row>
          {[
            {
              name: "BS. Nguyễn Văn A",
              specialty: "Nội khoa",
              img: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&w=400&q=80",
              desc: "Chuyên gia nội tổng quát, hơn 15 năm kinh nghiệm, từng tu nghiệp tại Pháp.",
            },
            {
              name: "BS. Trần Thị B",
              specialty: "Nhi khoa",
              img: "https://images.pexels.com/photos/8460036/pexels-photo-8460036.jpeg?auto=compress&w=400&q=80",
              desc: "Bác sĩ nhi giàu kinh nghiệm, tận tâm với trẻ nhỏ, tư vấn dinh dưỡng khoa học.",
            },
            {
              name: "BS. Lê Văn C",
              specialty: "Tư vấn tâm lý",
              img: "https://images.pexels.com/photos/8376293/pexels-photo-8376293.jpeg?auto=compress&w=400&q=80",
              desc: "Chuyên gia tâm lý, hỗ trợ sức khỏe tinh thần, từng công tác tại bệnh viện lớn.",
            },
          ].map((doctor, index) => (
            <Col md={4} className="mb-4" key={index} data-aos="fade-up">
              <Card className="doctor-card h-100 text-center shadow-lg">
                <Card.Img
                  variant="top"
                  src={doctor.img}
                  className="doctor-img"
                  alt={doctor.name + " - " + doctor.specialty}
                />
                <Card.Body>
                  <Card.Title>{doctor.name}</Card.Title>
                  <div className="text-secondary mb-2">{doctor.specialty}</div>
                  <Card.Text style={{ fontSize: "0.98rem" }}>
                    {doctor.desc}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Tra cứu sức khỏe nhanh */}
      <Container className="my-5 quick-tool-section">
        <h2 className="text-center text-gradient mb-4" data-aos="fade-up">
          Tra cứu sức khỏe nhanh
        </h2>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-sm p-3 mb-3">
              <Card.Body>
                <Card.Title className="mb-3">Tính chỉ số BMI</Card.Title>
                <form onSubmit={calcBMI} className="d-flex flex-column gap-2">
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="number"
                      min="80"
                      max="250"
                      className="form-control"
                      placeholder="Chiều cao (cm)"
                      value={bmiHeight}
                      onChange={(e) => setBmiHeight(e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      min="20"
                      max="200"
                      className="form-control"
                      placeholder="Cân nặng (kg)"
                      value={bmiWeight}
                      onChange={(e) => setBmiWeight(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" variant="info">
                    Tính BMI
                  </Button>
                </form>
                {bmiResult && (
                  <div className="mt-3 text-center">
                    <div>
                      <b>BMI:</b> {bmiResult}
                    </div>
                    <div>
                      <b>Kết luận:</b> {bmiMsg}
                    </div>
                  </div>
                )}
                {!bmiResult && bmiMsg && (
                  <div className="mt-3 text-danger text-center">{bmiMsg}</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Kiến thức sức khỏe */}
      <Container className="my-5">
        <h2 className="text-center text-gradient mb-5" data-aos="fade-up">
          Kiến thức sức khỏe
        </h2>
        <Row>
          {[
            {
              title: "5 thực phẩm ăn thường xuyên có lợi cho thận",
              desc: "Thận thực hiện rất nhiều chức năng quan trọng trong cơ thể như lọc chất thải và độc tố ra khỏi máu, duy trì sức khỏe tổng thể. Giữ cho thận khỏe mạnh là điều cần thiết",
              link: "https://vnexpress.net/5-thuc-pham-an-thuong-xuyen-co-loi-cho-than-4892719.html",
            },
            {
              title: "Uống gì phòng cúm?",
              desc: "Mùa mưa, thời tiết ẩm ướt là điều kiện thuận lợi cho virus và vi khuẩn phát triển gây bệnh cảm cúm. Chế độ nghỉ ngơi, ăn uống khoa học, ưu tiên các thức uống phù hợp giúp bảo vệ sức khỏe hô hấp, phòng bệnh ",
              link: "https://vnexpress.net/uong-gi-phong-cum-4890717.html",
            },
            {
              title: "Những thực phẩm thanh nhiệt, tái tạo da mùa nắng.",
              desc: "Mùa hè là thời điểm tia cực tím (UV) đạt mức cao nhất trong năm, ảnh hưởng rõ rệt đến sức khỏe làn da và cơ thể. Để bảo vệ da, mọi người có thể bổ sung thực phẩm thanh nhiệt, tái tạo từ bên trong.",
              link: "https://vnexpress.net/nhung-thuc-pham-thanh-nhiet-tai-tao-da-mua-nang-4891109.html",
            },
          ].map((tip, index) => (
            <Col md={4} className="mb-4" key={index} data-aos="fade-up">
              <Card className="h-100 shadow-sm border-info">
                <Card.Body>
                  <Card.Title className="text-info">🩺 {tip.title}</Card.Title>
                  <Card.Text>{tip.desc}</Card.Text>
                  <Button
                    variant="outline-info"
                    size="sm"
                    href={tip.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Đọc thêm
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Cảm nhận người dân */}
      <Container className="my-5">
        <h2 className="text-center text-gradient mb-5" data-aos="fade-up">
          Cảm nhận từ cộng đồng
        </h2>
        <Row>
          {[
            "Chất lượng dịch vụ tuyệt vời, bác sĩ tận tâm.",
            "Đăng ký nhanh chóng, không phải chờ lâu.",
            "Cảm thấy yên tâm mỗi khi đến khám.",
          ].map((feedback, index) => (
            <Col md={4} className="mb-4" key={index} data-aos="zoom-in">
              <Card className="text-center shadow-sm border-success">
                <Card.Body>
                  <Card.Text>"{feedback}"</Card.Text>
                  <Card.Footer className="text-muted">
                    – Người dân Q. Y Tế
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Tin tức y tế */}
      <Container className="my-5">
        <h2 className="text-center text-gradient mb-5" data-aos="fade-up">
          Tin tức y tế
        </h2>
        {!newsError && news.length > 0 ? (
          <Slider {...newsSliderSettings}>
            {news.map((item, idx) => {
              const imgSrc = item.image;
              return (
                <div key={idx}>
                  <Card className="news-card h-100 shadow-sm mx-2">
                    <Card.Img
                      variant="top"
                      src={imgSrc}
                      alt={item.title}
                      className="news-img"
                    />
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>{item.description.slice(0, 120)}...</Card.Text>
                      <Button
                        variant="outline-info"
                        size="sm"
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem chi tiết
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </Slider>
        ) : (
          <Row>
            {[
              {
                title: "Bộ Y tế cảnh báo dịch sốt xuất huyết tăng cao",
                img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                desc: "Các chuyên gia khuyến cáo người dân chủ động phòng chống muỗi, vệ sinh môi trường sống để hạn chế dịch bệnh lây lan.",
                link: "#",
              },
              {
                title: "5 thực phẩm giúp tăng cường miễn dịch mùa hè",
                img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
                desc: "Bổ sung các loại rau củ quả giàu vitamin C giúp cơ thể khỏe mạnh, phòng tránh bệnh tật.",
                link: "#",
              },
              {
                title: "Khám sức khỏe định kỳ: Lợi ích và lưu ý quan trọng",
                img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd21?auto=format&fit=crop&w=400&q=80",
                desc: "Khám sức khỏe định kỳ giúp phát hiện sớm các bệnh lý, nâng cao chất lượng cuộc sống.",
                link: "#",
              },
            ].map((news, idx) => (
              <Col md={4} className="mb-4" key={idx} data-aos="fade-up">
                <Card className="news-card h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={news.img}
                    alt={news.title}
                    className="news-img"
                  />
                  <Card.Body>
                    <Card.Title>{news.title}</Card.Title>
                    <Card.Text>{news.desc}</Card.Text>
                    <Button variant="outline-info" size="sm" href={news.link}>
                      Xem chi tiết
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Liên hệ + Google Map */}
      <Container className="my-5">
        <Row className="align-items-stretch contact-row">
          <Col md={6} className="mb-4 mb-md-0" data-aos="fade-right">
            <div className="map-container h-100">
              <iframe
                title="Bản đồ Trung tâm Y tế Cộng Đồng"
                src="https://www.google.com/maps?q=10.762622,106.660172&z=15&output=embed"
                width="100%"
                height="320"
                style={{
                  border: 0,
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(32,201,151,0.07)",
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </Col>
          <Col
            md={6}
            className="d-flex flex-column justify-content-center"
            data-aos="fade-left"
          >
            <div className="contact-section h-100 d-flex flex-column justify-content-center">
              <h2 className="text-gradient mb-3">Liên hệ với chúng tôi</h2>
              <p>Địa chỉ: 123 Đường Sức Khỏe, Quận Y Tế, TP. Hạnh Phúc</p>
              <p>
                Hotline: <strong>1900 123 456</strong> | Email:
                contact@ytcc.com.vn
              </p>
              <Button variant="outline-info" className="mt-3 align-self-center">
                Gửi phản hồi
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="footer text-white text-center py-4">
        <p className="mb-0">
          &copy; 2025 Trung tâm Y tế Cộng Đồng. All rights reserved.
        </p>
      </footer>
      <FloatingChatbot />
    </div>
  );
}
