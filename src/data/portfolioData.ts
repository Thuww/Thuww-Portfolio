import { Waypoint, Project, SkillCategory, JournalPost, Badge } from '../types';

export const PERSONAL_INFO = {
  name: "Minh Thu",
  fullName: "Lê Thị Minh Thư",
  englishName: "Thuww",
  role: "Frontend Developer & Software Engineer | AI & STEM Facilitator",
  title: "Cử nhân Thị giác Máy tính • Frontend & AI Engineer",
  statusBadge: "Sẵn sàng đón nhận cơ hội nghề nghiệp mới ✦",
  heroHeading: "Xin chào, tôi là Lê Thị Minh Thu 🌸",
  heroSubtitle: "Kỹ sư phần mềm tốt nghiệp Cử nhân Thị giác Máy tính tại ĐH Khoa học Tự nhiên (HCMUS). Đam mê xây dựng ứng dụng web hiện đại, kết hợp công nghệ AI, trải nghiệm người dùng và tư duy lấy con người làm trung tâm.",
  level: 22,
  currentXp: 16500,
  maxXp: 20000,
  dailyXp: 450,
  dailyMaxXp: 600,
  phone: "0888 392 122",
  email: "minhthu2k33@gmail.com",
  location: "Quận Tân Phú, TP. Hồ Chí Minh",
  vibe: "Tỉ mỉ • Trách nhiệm • Sáng tạo 💻✨",
  motto: "Biến công nghệ và dữ liệu thành giải pháp số hữu ích, mang lại giá trị thực tiễn cho người dùng và doanh nghiệp.",
  noteToSelf: "Không ngừng học hỏi, tận tâm trong từng dòng code và thiết kế.",
  socials: {
    github: "https://github.com/Thuww",
    linkedin: "https://linkedin.com",
    portfolioCanva: "https://thuw-portfolio.my.canva.site/",
    designWorks: "https://bit.ly/Thu_DesignPicture",
    productList: "https://bit.ly/Thu_Product",
    email: "mailto:minhthu2k33@gmail.com",
    phone: "tel:0888392122",
  },
  education: {
    university: "Trường Đại học Khoa học Tự nhiên - ĐHQG-HCM (VNUHCM - University of Science)",
    degree: "Cử nhân Thị giác Máy tính (Bachelor of Computer Vision)",
    gpa: "8.35 / 10 (~ 3.34 / 4.0)",
    period: "09/2021 - 09/2025",
    masterProgram: "Chương trình Tích hợp Cử nhân - Thạc sĩ (Master of Science in Integrated Science, 12/2025 - nay)",
    language: "Tiếng Anh: VSTEP B1"
  }
};

export const WAYPOINTS: Waypoint[] = [
  {
    id: "about",
    number: "01",
    title: "HỒ SƠ NĂNG LỰC",
    subtitle: "Giới thiệu & Học vấn",
    iconName: "User",
    position: [-10, 8, -6],
    sectionKey: "about",
    color: "#ec4899", // pink
  },
  {
    id: "projects",
    number: "02",
    title: "DỰ ÁN NỔI BẬT",
    subtitle: "Livestream Studio",
    iconName: "Laptop",
    position: [2, 5, -8],
    sectionKey: "projects",
    color: "#8b5cf6", // purple
  },
  {
    id: "skills",
    number: "03",
    title: "KỸ NĂNG CHUYÊN MÔN",
    subtitle: "Frontend, AI & Tools",
    iconName: "Wrench",
    position: [12, 7, -12],
    sectionKey: "skills",
    color: "#3b82f6", // blue
  },
  {
    id: "journal",
    number: "04",
    title: "HOẠT ĐỘNG XÃ HỘI",
    subtitle: "STEM & VietHope",
    iconName: "BookOpen",
    position: [14, 2, -2],
    sectionKey: "journal",
    color: "#10b981", // green/emerald
  },
  {
    id: "contact",
    number: "05",
    title: "KẾT NỐI LIÊN HỆ",
    subtitle: "Gửi tin nhắn & CV",
    iconName: "Send",
    position: [5, 0, 4],
    sectionKey: "contact",
    color: "#f43f5e", // rose
  },
];

export const TECH_STACK = [
  { name: "React.js", icon: "⚛️", color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
  { name: "Next.js", icon: "▲", color: "bg-neutral-500/10 text-neutral-800 dark:text-neutral-200 border-neutral-500/20" },
  { name: "TypeScript", icon: "TS", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { name: "Tailwind CSS", icon: "🌊", color: "bg-sky-500/10 text-sky-500 border-sky-500/20" },
  { name: "Python / AI", icon: "🐍", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { name: "OpenCV", icon: "👁️", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { name: "C / C++", icon: "⚡", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  { name: "Java", icon: "☕", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  { name: "Three.js / WebGL", icon: "🧊", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { name: "WordPress", icon: "🌐", color: "bg-teal-500/10 text-teal-500 border-teal-500/20" },
];

export const PROJECTS: Project[] = [
  {
  id: "graduation-invitation",

  title: "Graduation Invitation Website",
  titleEn: "Graduation Invitation Website",

  tagline:
    "Website thiệp mời tốt nghiệp được tự thiết kế, phát triển và tối ưu với AI-assisted development.",
  taglineEn:
    "A self-designed and developed graduation invitation website built with AI-assisted development.",

  description:
    "Dự án cá nhân tự thiết kế và phát triển một website thiệp mời tốt nghiệp từ đầu. Sử dụng AI để hỗ trợ quá trình phát triển, sau đó trực tiếp chỉnh sửa, tổ chức lại và hoàn thiện code để tạo ra giao diện responsive, phù hợp trên cả desktop và mobile. Website được triển khai thực tế bằng Firebase Hosting.",

  descriptionEn:
    "A personal project where I designed and developed a graduation invitation website from scratch. Used AI to assist with the development process, then independently edited, refined, and customized the generated code to build a responsive experience for both desktop and mobile. The final website was deployed using Firebase Hosting.",

  role: "Web Developer · Personal Project",
  roleEn: "Web Developer · Personal Project",

  year: "11/2025",

  category: "Web & Creative",
  categoryEn: "Web & Creative",

  tags: [
    "HTML5",
    "Tailwind CSS",
    "JavaScript",
    "Firebase Hosting",
    "AI-assisted Development",
    "Responsive Web"
  ],

  metrics:
    "Designed & Built from Scratch • AI-assisted Development • Responsive",
  metricsEn:
    "Designed & Built from Scratch • AI-assisted Development • Responsive",

  previewColor:
    "from-fuchsia-600 via-pink-500 to-cyan-500",

  demoUrl:
    "https://minhthu-gradinvite.web.app/",

  features: [
    "Tự lên ý tưởng, thiết kế và phát triển website thiệp mời tốt nghiệp từ đầu.",

    "Sử dụng AI để hỗ trợ quá trình viết và phát triển code, sau đó trực tiếp chỉnh sửa, tùy biến và hoàn thiện sản phẩm theo ý tưởng thiết kế.",

    "Xây dựng giao diện responsive, tối ưu trải nghiệm hiển thị trên cả desktop và mobile.",

    "Phát triển website bằng HTML5, Tailwind CSS và JavaScript.",

    "Triển khai website thực tế trên Firebase Hosting."
  ],

  featuresEn: [
    "Designed and developed the graduation invitation website from scratch as a personal creative project.",

    "Used AI to assist with code generation and development, then independently edited, customized, and refined the implementation to match the intended design.",

    "Built a responsive interface optimized for both desktop and mobile devices.",

    "Developed the website using HTML5, Tailwind CSS, and JavaScript.",

    "Deployed the completed website using Firebase Hosting."
  ]
},

  {
    id: "ortho-fashion",

    title: "Ortho Fashion — Production Web & AI Integration",
    titleEn: "Ortho Fashion — Production Web & AI Integration",

    tagline:
      "Phát triển nhiều sản phẩm web production cho hệ sinh thái Ortho Fashion, kết hợp Frontend, AI và Web3.",
    taglineEn:
      "Developed multiple production web applications across the Ortho Fashion ecosystem, combining Frontend, AI, and Web3 technologies.",

    description:
      "Tham gia phát triển Ortho Fashion từ vị trí Front-end Intern đến Front-end Developer, trực tiếp xây dựng và duy trì nhiều production websites và web applications của công ty thay vì chỉ một nền tảng thương mại điện tử. Công việc bao gồm company landing pages, e-commerce interfaces, internal admin dashboards và các tính năng tương tác tích hợp AI/Web3. Phối hợp với UI/UX designers và backend developers để triển khai tính năng, tích hợp REST APIs, xử lý lỗi và tối ưu trải nghiệm người dùng trên nhiều thiết bị.",

    descriptionEn:
      "Contributed to Ortho Fashion from Front-end Intern to Front-end Developer, building and maintaining multiple production websites and web applications across the company ecosystem rather than a single e-commerce platform. Worked on company landing pages, e-commerce interfaces, internal admin dashboards, and AI/Web3-powered interactive features. Collaborated with UI/UX designers and backend developers to implement features, integrate REST APIs, resolve issues, and optimize user experiences across devices.",

    role: "Front-end Developer (Intern → Full-time)",
    roleEn: "Front-end Developer (Intern → Full-time)",

    year: "06/2024 - 02/2026",

    category: "Frontend · AI · Web3",
    categoryEn: "Frontend · AI · Web3",

    tags: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "REST API",
      "AI Integration",
      "AI Chatbot",
      "Virtual Try-On",
      "MetaMask",
      "Web3"
    ],

    metrics:
      "Multiple Production Websites • AI Integration • Web3 • Responsive UI",
    metricsEn:
      "Multiple Production Websites • AI Integration • Web3 • Responsive UI",

    previewColor:
      "from-purple-600 via-pink-600 to-rose-600",

    demoUrl: "https://ortho.fashion/",

    features: [
      "Phát triển và duy trì nhiều production websites và web applications của công ty, bao gồm company landing pages, e-commerce interfaces và internal admin dashboards.",

      "Xây dựng các giao diện responsive bằng React.js, Next.js, TypeScript và Tailwind CSS, đảm bảo trải nghiệm nhất quán trên desktop và mobile.",

      "Phát triển các module e-commerce như product listing, product details, filtering, shopping cart và checkout workflows.",

      "Tích hợp REST APIs với backend services để lấy, hiển thị và cập nhật dữ liệu sản phẩm, khách hàng và các chức năng của ứng dụng một cách động.",

      "Tích hợp các tính năng AI vào production web applications, bao gồm AI Stylist Chatbot, outfit recommendation và các workflow hỗ trợ trải nghiệm mua sắm cá nhân hóa.",

      "Tham gia tích hợp AI Virtual Try-On, kết nối giao diện Frontend với các workflow xử lý hình ảnh và AI để hỗ trợ trải nghiệm thử đồ ảo.",

      "Phát triển và tích hợp MetaMask wallet connection cho các tính năng Web3 trong ứng dụng.",

      "Refactor và module hóa các UI components nhằm tăng khả năng tái sử dụng, maintainability và scalability giữa nhiều production projects.",

      "Phối hợp với UI/UX designers và backend developers trong môi trường Agile để triển khai features, kiểm thử API integration, fix bugs và xử lý các vấn đề UI/UX dựa trên QA và client feedback."
    ],

    featuresEn: [
      "Developed and maintained multiple production websites and web applications across the company, including company landing pages, e-commerce interfaces, and internal admin dashboards.",

      "Built responsive user interfaces using React.js, Next.js, TypeScript, and Tailwind CSS, ensuring consistent experiences across desktop and mobile devices.",

      "Developed e-commerce modules including product listing, product details, filtering, shopping cart, and checkout workflows.",

      "Integrated REST APIs with backend services to dynamically fetch, display, and update product, customer, and application data.",

      "Integrated AI-powered features into production web applications, including an AI Stylist Chatbot, outfit recommendation, and personalized shopping workflows.",

      "Contributed to the integration of an AI Virtual Try-On feature by connecting front-end interfaces with AI-powered image processing workflows for virtual outfit visualization.",

      "Developed and integrated MetaMask wallet connectivity to support Web3-based features within the applications.",

      "Refactored and modularized reusable UI components to improve maintainability, scalability, and consistency across multiple production projects.",

      "Collaborated with UI/UX designers and backend developers in an Agile environment to implement features, test API integrations, fix bugs, and resolve UI/UX issues based on QA and client feedback."
    ]
  },

{
  id: "viethope-vsdp",

  title: "VietHope VSDP Scholarship Application Platform",
  titleEn: "VietHope VSDP Scholarship Application Platform",

  tagline:
    "Nền tảng ứng tuyển học bổng trực tuyến với Portal cho ứng viên, hội đồng đánh giá và hỗ trợ chấm điểm bằng AI.",
  taglineEn:
    "Online scholarship application platform with applicant and reviewer portals, supported by AI-assisted application scoring.",

  description:
    "Phát triển nền tảng ứng tuyển học bổng VietHope VSDP, bao gồm các portal dành cho ứng viên và người đánh giá hồ sơ. Phụ trách xây dựng responsive forms, dashboards và các UI components có khả năng tái sử dụng; đồng thời tích hợp REST APIs với backend cho quy trình nộp và đánh giá hồ sơ. Hệ thống cũng tích hợp AI-assisted application scoring nhằm hỗ trợ quá trình đánh giá hồ sơ học bổng.",

  descriptionEn:
    "Developed the VietHope VSDP scholarship application platform with dedicated portals for applicants and reviewers. Built responsive forms, dashboards, and reusable UI components, while integrating REST APIs with backend services to support application submission and review workflows. The platform also included AI-assisted application scoring to support scholarship evaluation.",

  role: "Frontend Developer",
  roleEn: "Frontend Developer",

  year: "2024 - 2025",

  category: "Web & Frontend",
  categoryEn: "Web & Frontend",

  tags: [
    "React.js",
    "TypeScript",
    "Tailwind CSS",
    "REST API",
    "AI Scoring",
    "Responsive UI"
  ],

  metrics:
    "Applicant Portal • Reviewer Portal • AI-Assisted Evaluation",
  metricsEn:
    "Applicant Portal • Reviewer Portal • AI-Assisted Evaluation",

  previewColor:
    "from-blue-600 via-cyan-600 to-teal-500",

  demoUrl:
    "https://viethope.org/programs/vsdp2025/",

  features: [
    "Phát triển nền tảng ứng tuyển học bổng với các portal riêng dành cho ứng viên và người đánh giá hồ sơ.",

    "Xây dựng responsive application forms, dashboards và các UI components có khả năng tái sử dụng.",

    "Tích hợp AI-assisted application scoring nhằm hỗ trợ quá trình đánh giá và chấm điểm hồ sơ học bổng.",

    "Kết nối Frontend với backend APIs để xử lý dữ liệu và hỗ trợ các workflow nộp hồ sơ, đánh giá và quản lý ứng viên.",

    "Phối hợp xây dựng giao diện trực quan, responsive và nhất quán cho các nhóm người dùng khác nhau."
  ],

  featuresEn: [
    "Developed dedicated applicant and reviewer portals for the scholarship application and evaluation process.",

    "Built responsive application forms, dashboards, and reusable UI components.",

    "Integrated AI-assisted application scoring to support scholarship application evaluation.",

    "Connected the frontend with backend APIs to support application submission, review, and applicant data workflows.",

    "Collaborated to deliver intuitive, responsive, and consistent interfaces for different user groups."
  ]
},
  {
  id: "virtual-tryon-ai",

  title: "Virtual Try-On using Deep Learning",
  titleEn: "Virtual Try-On using Deep Learning",

  tagline:
    "Hệ thống Thử Đồ Ảo dựa trên Deep Learning với phương pháp chỉnh sửa màu trang phục bằng văn bản.",
  taglineEn:
    "Deep Learning-based Virtual Try-On with text-guided garment color editing.",

  description:
    "Đề tài Khóa luận tốt nghiệp tập trung nghiên cứu và xây dựng hệ thống Virtual Try-On (VTON) dựa trên Deep Learning, có khả năng tạo hình ảnh người mặc trang phục mục tiêu một cách chân thực trong khi giữ nguyên hình dáng cơ thể và các chi tiết của trang phục. Đề tài cải tiến kiến trúc CatVTON nhằm giảm chi phí tính toán nhưng vẫn duy trì chất lượng tổng hợp hình ảnh, đồng thời đề xuất phương pháp chỉnh sửa màu trang phục dựa trên câu lệnh văn bản.",

  descriptionEn:
    "Undergraduate graduation thesis focused on developing a Deep Learning-based Virtual Try-On (VTON) system that generates realistic images of people wearing target garments while preserving body shape and clothing details. The project improved the CatVTON architecture to reduce computational cost while maintaining high-quality image synthesis, and proposed a text-guided garment color editing method.",

  role: "Undergraduate Thesis",
  roleEn: "Undergraduate Thesis",

  year: "07/2025",

  category: "AI & Computer Vision",
  categoryEn: "AI & Computer Vision",

  tags: [
    "Python",
    "PyTorch",
    "CatVTON",
    "Deep Learning",
    "Computer Vision",
    "NLP",
    "DeepLabV3",
    "HSV",
    "SSIM",
    "FID",
    "LPIPS"
  ],

  metrics:
    "CatVTON Optimization • DressCode & VITON-HD • SSIM / FID / LPIPS",
  metricsEn:
    "CatVTON Optimization • DressCode & VITON-HD • SSIM / FID / LPIPS",

  previewColor:
    "from-amber-500 via-rose-500 to-indigo-600",

  features: [
    "Xây dựng hệ thống Deep Learning-based Virtual Try-On (VTON) có khả năng tạo hình ảnh người mặc trang phục mục tiêu một cách chân thực, đồng thời giữ nguyên hình dáng cơ thể và các chi tiết của trang phục.",

    "Cải tiến kiến trúc CatVTON nhằm giảm chi phí tính toán trong quá trình xử lý nhưng vẫn duy trì chất lượng cao của hình ảnh tổng hợp.",

    "Đề xuất phương pháp chỉnh sửa màu sắc trang phục dựa trên câu lệnh văn bản, kết hợp trích xuất màu bằng NLP, phân đoạn hình ảnh với DeepLabV3 và biến đổi màu trong không gian HSV.",

    "Thực hiện các thí nghiệm trên hai benchmark phổ biến là DressCode và VITON-HD để đánh giá chất lượng và hiệu quả của phương pháp.",

    "Đánh giá kết quả bằng các chỉ số SSIM, FID và LPIPS, qua đó phân tích sự cân bằng giữa chất lượng hình ảnh và hiệu quả tính toán."
  ],

  featuresEn: [
    "Developed a Deep Learning-based Virtual Try-On (VTON) system to generate realistic images of people wearing target garments while preserving body shape and clothing details.",

    "Improved the CatVTON architecture to reduce computational cost while maintaining high-quality image synthesis.",

    "Proposed a text-guided garment color editing method combining NLP-based color extraction, DeepLabV3 image segmentation, and HSV-based color transformation.",

    "Conducted experiments on two benchmark datasets, DressCode and VITON-HD, to evaluate the quality and effectiveness of the proposed approach.",

    "Evaluated the results using SSIM, FID, and LPIPS, demonstrating the trade-off between visual quality and computational efficiency."
  ]
},
  {
  id: "taskify-app",

  title: "Taskify Website",
  titleEn: "Taskify Website",

  tagline:
    "Website tạo và quản lý công việc với tính năng chỉnh sửa, hoàn thành và sắp xếp task bằng kéo thả.",
  taglineEn:
    "Task management website with task editing, completion, and drag-and-drop organization.",

  description:
    "Xây dựng website Taskify cho phép người dùng tạo và quản lý danh sách công việc. Người dùng có thể thêm, chỉnh sửa, xóa, đánh dấu hoàn thành và sắp xếp lại các task bằng thao tác kéo thả. Dự án được phát triển bằng ReactJS và TypeScript, sử dụng thư viện react-beautiful-dnd để triển khai chức năng Drag & Drop.",

  descriptionEn:
    "Built Taskify, a web application for creating and managing to-do lists. Users can add, edit, delete, mark tasks as completed, and rearrange tasks through drag-and-drop interactions. Developed with ReactJS and TypeScript, using the react-beautiful-dnd library to implement the drag-and-drop functionality.",

  role: "Frontend Developer",
  roleEn: "Frontend Developer",

  year: "10/2023",

  category: "Web & Frontend",
  categoryEn: "Web & Frontend",

  tags: [
    "ReactJS",
    "TypeScript",
    "react-beautiful-dnd"
  ],

  metrics:
    "Task Management • Drag & Drop • ReactJS + TypeScript",
  metricsEn:
    "Task Management • Drag & Drop • ReactJS + TypeScript",

  previewColor:
    "from-emerald-500 via-teal-600 to-cyan-600",

  demoUrl:
    "https://thuww.github.io/React-TypeScript-Taskify/",

  githubUrl:
    "https://github.com/Thuww/React-TypeScript-Taskify",

  features: [
    "Xây dựng website cho phép người dùng tạo và quản lý danh sách công việc.",

    "Triển khai các chức năng thêm, chỉnh sửa, xóa và đánh dấu hoàn thành task.",

    "Sử dụng thao tác Drag & Drop để sắp xếp lại các task trong danh sách.",

    "Phát triển ứng dụng bằng ReactJS và TypeScript, áp dụng cấu trúc component cho giao diện và logic quản lý task.",

    "Sử dụng thư viện react-beautiful-dnd để triển khai chức năng kéo thả và sắp xếp công việc."
  ],

  featuresEn: [
    "Built a web application for creating and managing to-do lists.",

    "Implemented task creation, editing, deletion, and completion functionality.",

    "Enabled users to rearrange tasks using drag-and-drop interactions.",

    "Developed the application with ReactJS and TypeScript using a component-based structure.",

    "Used the react-beautiful-dnd library to implement task drag-and-drop and reordering."
  ]
},
  {
  id: "remote-control-java",

  title: "Remote Control App",
  titleEn: "Remote Control App",

  tagline:
    "Ứng dụng điều khiển máy tính từ xa với các chức năng quản lý tiến trình, chụp màn hình và điều khiển hệ thống.",
  taglineEn:
    "Remote computer control application for process management, screen capture, and system control.",

  description:
    "Đồ án nhóm phát triển một chương trình điều khiển máy tính từ xa bằng Java. Ứng dụng cung cấp các chức năng quản lý tiến trình và ứng dụng đang chạy, khởi động hoặc dừng process/app, chụp màn hình máy tính từ xa, ghi nhận thao tác phím và thực hiện lệnh tắt máy.",

  descriptionEn:
    "A group project developing a Java-based remote computer control application. The application provides functions for listing running processes and applications, starting or stopping processes/apps, capturing the remote screen, detecting key presses, and triggering system shutdown.",

  role: "Java Developer · Group Project",
  roleEn: "Java Developer · Group Project",

  year: "10/2022 - 11/2022",

  category: "Software Development",
  categoryEn: "Software Development",

  tags: [
    "Java",
    "NetBeans IDE",
    "Java Development Kit",
    "PowerShell"
  ],

  metrics:
    "Remote Computer Control • Process Management • Screen Capture",
  metricsEn:
    "Remote Computer Control • Process Management • Screen Capture",

  previewColor:
    "from-indigo-600 via-purple-600 to-slate-800",

  demoUrl:
    "https://bit.ly/Demo_RemoveControl",

  githubUrl:
    "https://github.com/TanHiep-To/Remote_Control",

  features: [
    "Phát triển ứng dụng điều khiển máy tính từ xa bằng ngôn ngữ Java trong nhóm 6 thành viên.",

    "Xây dựng chức năng liệt kê các tiến trình và ứng dụng đang chạy trên máy tính.",

    "Hỗ trợ khởi động và dừng process hoặc application từ xa.",

    "Triển khai chức năng chụp màn hình máy tính từ xa.",

    "Hỗ trợ ghi nhận thao tác phím (Key Press) và thực hiện chức năng tắt máy tính từ xa.",

    "Sử dụng NetBeans IDE, Java Development Kit và PowerShell trong quá trình phát triển."
  ],

  featuresEn: [
    "Developed a remote computer control application using Java as part of a 6-member team project.",

    "Implemented functionality to list processes and applications currently running on the computer.",

    "Supported starting and stopping processes or applications remotely.",

    "Implemented remote screen capture functionality.",

    "Supported key press detection and remote computer shutdown functionality.",

    "Used NetBeans IDE, Java Development Kit, and PowerShell during development."
  ]
},
{
  id: "chess-game-cpp",

  title: "Chess Game",
  titleEn: "Chess Game",

  tagline:
    "Trò chơi Cờ vua 2 người chơi được xây dựng bằng C++ và lập trình hướng đối tượng.",
  taglineEn:
    "2-player Chess Game developed with C++ and Object-Oriented Programming.",

  description:
    "Đồ án nhóm phát triển một trò chơi Cờ vua dành cho 2 người chơi với các tính năng cơ bản. Dự án sử dụng ngôn ngữ C++ và áp dụng phương pháp lập trình hướng đối tượng (OOP) để xây dựng các đối tượng trong game, kết hợp thư viện SFML để phát triển các thành phần đồ họa.",

  descriptionEn:
    "A group project developing a 2-player Chess Game with basic gameplay features. The project was implemented in C++ using Object-Oriented Programming (OOP) principles to build in-game objects, with the SFML library used for graphical components.",

  role: "C++ Developer · Group Project",
  roleEn: "C++ Developer · Group Project",

  year: "05/2023 - 06/2023",

  category: "Game Development",
  categoryEn: "Game Development",

  tags: [
    "C++",
    "OOP",
    "SFML"
  ],

  metrics:
    "2-Player Game • C++ • Object-Oriented Programming",
  metricsEn:
    "2-Player Game • C++ • Object-Oriented Programming",

  previewColor:
    "from-amber-600 via-orange-600 to-rose-700",

  demoUrl:
    "https://bit.ly/Demo_ChessGame",

  features: [
    "Phát triển trò chơi Cờ vua dành cho 2 người chơi với các tính năng chơi cơ bản.",

    "Sử dụng ngôn ngữ C++ để xây dựng logic và các thành phần của trò chơi.",

    "Áp dụng phương pháp lập trình hướng đối tượng (OOP) để xây dựng và quản lý các đối tượng trong game.",

    "Sử dụng thư viện SFML để phát triển các thành phần đồ họa của trò chơi.",

    "Thực hiện dự án theo nhóm gồm 3 thành viên."
  ],

  featuresEn: [
    "Developed a 2-player Chess Game with basic gameplay features.",

    "Used C++ to implement the game logic and core components.",

    "Applied Object-Oriented Programming (OOP) principles to build and manage in-game objects.",

    "Used the SFML library to develop the graphical components of the game.",

    "Completed the project as part of a 3-member team."
  ]
},
{
  id: "ai-search-games",

  title: "Artificial Intelligence Game",
  titleEn: "Artificial Intelligence Game",

  tagline:
    "Ứng dụng các thuật toán Trí tuệ Nhân tạo vào game Pacman và Wumpus.",
  taglineEn:
    "Applying Artificial Intelligence algorithms to Pacman and Wumpus games.",

  description:
    "Dự án xây dựng các game mô phỏng nhằm ứng dụng các thuật toán Trí tuệ Nhân tạo. Phát triển game Pacman và game Wumpus, đồng thời áp dụng các thuật toán tìm kiếm như A*, BFS và DFS để giải quyết các bài toán tìm kiếm trong môi trường game. Dự án được thực hiện bằng Python.",

  descriptionEn:
    "A project applying Artificial Intelligence algorithms to simulated game environments. Developed Pacman and Wumpus games and applied search algorithms including A*, BFS, and DFS to solve search problems within the game environments. The project was implemented using Python.",

  role: "AI Developer · Group Project",
  roleEn: "AI Developer · Group Project",

  year: "09/2023 - 12/2023",

  category: "AI & Game Development",
  categoryEn: "AI & Game Development",

  tags: [
    "Python",
    "Artificial Intelligence",
    "A* Search",
    "BFS",
    "DFS"
  ],

  metrics:
    "Pacman • Wumpus • A* / BFS / DFS",
  metricsEn:
    "Pacman • Wumpus • A* / BFS / DFS",

  previewColor:
    "from-yellow-500 via-amber-600 to-stone-800",

  githubUrl:
    "https://github.com/qduy119/AI-Lab1-Searching",

  features: [
    "Xây dựng game Pacman như một môi trường mô phỏng để áp dụng các thuật toán tìm kiếm trong Trí tuệ Nhân tạo.",

    "Xây dựng game Wumpus và áp dụng các phương pháp AI để xử lý bài toán trong môi trường game.",

    "Hiện thực và áp dụng các thuật toán tìm kiếm A*, BFS và DFS.",

    "Sử dụng Python để phát triển các thuật toán và logic của game.",

    "Thực hành ứng dụng các thuật toán AI vào các bài toán tìm kiếm và ra quyết định trong môi trường mô phỏng."
  ],

  featuresEn: [
    "Built a Pacman game as a simulated environment for applying Artificial Intelligence search algorithms.",

    "Developed a Wumpus game and applied AI approaches to solve problems within the game environment.",

    "Implemented and applied A*, BFS, and DFS search algorithms.",

    "Used Python to develop the game logic and AI algorithms.",

    "Applied AI search and decision-making approaches to simulated game environments."
  ]
},
{
  id: "rock-paper-scissors",

  title: "Rock Paper Scissors Game Website",
  titleEn: "Rock Paper Scissors Game Website",

  tagline:
    "Website trò chơi Kéo Búa Bao tương tác với máy tính, tự động tính và hiển thị điểm số.",
  taglineEn:
    "Interactive Rock Paper Scissors game website with automatic score calculation and display.",

  description:
    "Xây dựng website trò chơi Kéo Búa Bao cho phép người dùng chơi với máy tính. Ứng dụng tự động tính toán điểm số và hiển thị kết quả trực tiếp trên màn hình. Dự án được phát triển bằng JavaScript, CSS và HTML, đồng thời được thực hiện dựa trên một tutorial của freeCodeCamp trên YouTube.",

  descriptionEn:
    "Built a Rock Paper Scissors game website that allows users to play against the computer. The application automatically calculates scores and displays the results on the screen. Developed using JavaScript, CSS, and HTML based on a freeCodeCamp tutorial on YouTube.",

  role: "Frontend Developer",
  roleEn: "Frontend Developer",

  year: "09/2023",

  category: "Web & Game",
  categoryEn: "Web & Game",

  tags: [
    "JavaScript",
    "CSS",
    "HTML"
  ],

  metrics:
    "Browser Game • Player vs Computer • Score Calculation",
  metricsEn:
    "Browser Game • Player vs Computer • Score Calculation",

  previewColor:
    "from-rose-500 via-pink-600 to-purple-600",

  demoUrl:
    "https://thuww.github.io/Rock-Paper-Scissors-Game/",

  githubUrl:
    "https://github.com/Thuww/Rock-Paper-Scissors-Game",

  features: [
    "Xây dựng website trò chơi Kéo Búa Bao cho phép người dùng chơi với máy tính.",

    "Triển khai logic tương tác giữa người chơi và máy tính trong trò chơi.",

    "Tự động tính toán điểm số và hiển thị kết quả trực tiếp trên màn hình.",

    "Sử dụng JavaScript, CSS và HTML để xây dựng giao diện và chức năng của trò chơi.",

    "Thực hiện dự án dựa trên tutorial của freeCodeCamp trên YouTube."
  ],

  featuresEn: [
    "Built a Rock Paper Scissors game website that allows users to play against the computer.",

    "Implemented interactive game logic between the player and the computer.",

    "Automatically calculated scores and displayed game results on the screen.",

    "Used JavaScript, CSS, and HTML to build the game's interface and functionality.",

    "Developed the project based on a freeCodeCamp tutorial on YouTube."
  ]
},
{
  id: "game-app-market",

  title: "Game App Market Website",
  titleEn: "Game App Market Website",

  tagline:
    "Website giới thiệu và phân phối game, cho phép nhà phát triển giới thiệu sản phẩm và người dùng tải game.",
  taglineEn:
    "Game marketplace website for showcasing games and allowing users to download available games.",

  description:
    "Đồ án nhóm xây dựng các game và phát triển một website hoạt động như một game app market. Website cung cấp các công cụ để nhà phát triển giới thiệu sản phẩm game, đồng thời cho phép người dùng xem thông tin và tải game về thiết bị để chơi. Dự án được thực hiện bởi nhóm 6 thành viên, chia thành hai nhóm phụ trách phát triển game và xây dựng website.",

  descriptionEn:
    "A group project focused on building games and developing a website that functions as a game app market. The platform provides tools for game developers to showcase their products and allows users to view and download available games to play on their devices. The project was completed by a 6-member team divided into two groups responsible for game development and website development.",

  role: "Web Developer · Group Project",
  roleEn: "Web Developer · Group Project",

  year: "11/2021 - 01/2022",

  category: "Web & Game Development",
  categoryEn: "Web & Game Development",

  tags: [
    "WiX",
    "Google Sites",
    "Unity"
  ],

  metrics:
    "Game Marketplace • Game Showcase • 6-Member Team",
  metricsEn:
    "Game Marketplace • Game Showcase • 6-Member Team",

  previewColor:
    "from-fuchsia-600 via-pink-600 to-cyan-600",

  features: [
    "Xây dựng website hoạt động như một game app market, nơi các sản phẩm game có thể được giới thiệu đến người dùng.",

    "Cung cấp không gian để game providers giới thiệu sản phẩm và cho phép người dùng xem, lựa chọn và tải game về thiết bị.",

    "Tham gia phát triển các game được giới thiệu trên nền tảng.",

    "Thực hiện dự án theo nhóm gồm 6 thành viên, được chia thành hai nhóm phụ trách phát triển game và xây dựng website.",

    "Sử dụng các công cụ có sẵn trên Internet như WiX, Google Sites và Unity trong quá trình phát triển."
  ],

  featuresEn: [
    "Built a website that functions as a game app market where game products can be showcased to users.",

    "Provided a platform for game providers to showcase their products and for users to view, select, and download games to their devices.",

    "Contributed to the development of games featured on the platform.",

    "Worked as part of a 6-member team divided into two groups responsible for game development and website development.",

    "Used available tools including WiX, Google Sites, and Unity during development."
  ]
},
  {
    id: "viethope-media",
    title: "VietHope Web Portal & Media Production",
    titleEn: "VietHope Web Portal & Media Production",
    tagline: "Cải tiến Website Tổ chức VietHope & Biên tập Video Sự kiện",
    taglineEn: "VietHope Official Website Enhancements & Event Media Production",
    description: "Đảm nhiệm vai trò Designer & Video Editor tại Marketing Team VietHope từ 12/2022 đến nay. Tham gia quản trị nội dung và cải tiến website chính thức của VietHope (viethope.org - trước đây là viethope.us). Trực tiếp thiết kế ấn phẩm đồ họa và sản xuất chuỗi video recap các chương trình lớn: Talkshow VietHope 27, MDP 2022, VSDP 2022 và Summit 2023.",
    descriptionEn: "Serving as Designer & Video Editor on the VietHope Marketing Team since December 2022. Maintaining and upgrading the official VietHope organization portal (viethope.org). Designing key visual assets and producing video recap series for signature events: Talkshow VietHope 27, MDP 2022, VSDP 2022, and Youth Summit 2023.",
    role: "Designer & Video Editor (VietHope Marketing Team)",
    roleEn: "Designer & Video Editor (VietHope Marketing Team)",
    year: "2022 - 2026",
    category: "Design & Media",
    categoryEn: "Design & Media",
    tags: ["WordPress", "Graphic Design", "Video Editing", "Premiere", "CapCut", "Marketing"],
    metrics: "10,000+ Lượt tiếp cận • 5+ Video Recap & Teaser Sự kiện",
    metricsEn: "10,000+ Social Reach • 5+ Produced Recap & Teaser Videos",
    previewColor: "from-teal-500 via-emerald-600 to-sky-700",
    demoUrl: "https://viethope.org/",
    features: [
      "Hỗ trợ cải tiến giao diện và tối ưu trải nghiệm người dùng trên website viethope.org (nền tảng WordPress)",
      "Sản xuất video giới thiệu (Teaser) cho Talkshow 27 của VietHope thu hút đông đảo sinh viên tham gia",
      "Biên tập các video recap trọng điểm: MDP 2022 (bit.ly/recap_MDP2022), VSDP 2022 (bit.ly/recap_VSDP2022), Summit 2023",
      "Cắt ghép các video ghi lại nội dung ý nghĩa: Văn nghệ VSDP (bit.ly/vanNghe_VSDP2022) và Mini Talk (bit.ly/miniTalk_VSDP2022)"
    ],
    featuresEn: [
      "Maintained and enhanced UI/UX layouts for the official viethope.org WordPress portal",
      "Produced the promotional teaser video for VietHope Talkshow 27, driving high student engagement",
      "Directed and edited flagship program recaps: MDP 2022, VSDP 2022, and Youth Summit 2023",
      "Created meaningful video highlights: VSDP Cultural Night and Mini-Talk reflection sessions"
    ]
  },

];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Lập trình Web & Frontend",
    icon: "Code2",
    skills: [
      { name: "React.js / Next.js", level: 95, icon: "⚛️", xp: "Production • 2+ năm", highlight: true },
      { name: "TypeScript / JavaScript", level: 92, icon: "TS", xp: "Strict Mode • Core", highlight: true },
      { name: "Tailwind CSS & HTML5/CSS3", level: 94, icon: "🌊", xp: "Responsive • Fluid UI" },
      { name: "RESTful APIs & State Management", level: 90, icon: "📦", xp: "Axios • Redux/Context" },
      { name: "Three.js & WebGL Basics", level: 86, icon: "🧊", xp: "3D Web • Shaders" },
    ]
  },
  {
    title: "Khoa học Máy tính, AI & Backend",
    icon: "Boxes",
    skills: [
      { name: "Thị giác Máy tính (OpenCV / CV)", level: 92, icon: "👁️", xp: "Bachelor of CV • HCMUS", highlight: true },
      { name: "Python & Deep Learning (PyTorch)", level: 90, icon: "🐍", xp: "CatVTON • DeepLabV3", highlight: true },
      { name: "Lập trình C / C++", level: 88, icon: "⚡", xp: "OOP • SFML Graphics" },
      { name: "Lập trình Java", level: 86, icon: "☕", xp: "Socket TCP/IP • Multi-thread" },
      { name: "Thuật toán AI (A*, BFS, DFS)", level: 88, icon: "🧠", xp: "Heuristics • Propositional Logic" },
    ]
  },
  {
    title: "Thiết kế, Quản trị Dự án & Giáo dục",
    icon: "Layers",
    skills: [
      { name: "Thiết kế Đồ họa & Video Editing", level: 92, icon: "🎨", xp: "Canva • Adobe • Premiere", highlight: true },
      { name: "Điều phối & Giảng dạy STEM - SEL", level: 93, icon: "🌱", xp: "Kidspire • 740+ học sinh", highlight: true },
      { name: "Quản trị Website WordPress & WiX", level: 90, icon: "🌐", xp: "VietHope • INFIKEY" },
      { name: "Git, GitHub & Quy trình Agile/Scrum", level: 90, icon: "🚀", xp: "Code Review • Teamwork" },
      { name: "Kỹ năng Giao tiếp & Giải quyết Vấn đề", level: 94, icon: "🤝", xp: "Human-Centered Approach" },
    ]
  }
];

export const AWARDS = [
  {
    title: "Học bổng 'Give Wings To Your Dream 2024'",
    org: "Bosch Global Software Technologies Vietnam",
    year: "2024",
    desc: "Học bổng danh giá trao tặng sinh viên xuất sắc khối ngành Công nghệ Thông tin & Kỹ thuật phần mềm."
  },
  {
    title: "Học bổng Cựu sinh viên Khoa CNTT 2023",
    org: "Trường ĐH Khoa học Tự nhiên - ĐHQG-HCM",
    year: "2023",
    desc: "Khen thưởng thành tích học tập và rèn luyện vượt trội của khoa Công nghệ Thông tin."
  },
  {
    title: "Học bổng 'VietHope's Youth Development Program' (2021 & 2022)",
    org: "VietHope Organization",
    year: "2021 - 2022",
    desc: "Hai năm liên tiếp nhận học bổng phát triển thanh niên ưu tú vượt khó của tổ chức phi chính phủ VietHope."
  },
  {
    title: "Học bổng 'Christina Noble Education Programme'",
    org: "Christina Noble Children's Foundation (CNCF)",
    year: "2022 - 2024",
    desc: "Tài trợ và đồng hành giáo dục cho sinh viên có tinh thần cống hiến vì cộng đồng."
  }
];

export const BADGES: Badge[] = [
  {
    id: "hcmus-graduate",
    title: "HCMUS Graduate",
    description: "Cử nhân Thị giác Máy tính - ĐH Khoa học Tự nhiên (GPA 8.35/10)",
    icon: "🎓",
    unlocked: true,
    color: "from-blue-400 to-cyan-600",
  },
  {
    id: "ortho-developer",
    title: "Production Engineer",
    description: "Xây dựng website thực tế, UI Login & AI Chatbot tại Ortho Fashion",
    icon: "💻",
    unlocked: true,
    color: "from-purple-400 to-pink-600",
  },
  {
    id: "stem-facilitator",
    title: "STEM & SEL Leader",
    description: "Điều phối chương trình STEM cho hơn 740 học sinh tại Kidspire Vietnam",
    icon: "🌱",
    unlocked: true,
    color: "from-emerald-400 to-teal-600",
  },
  {
    id: "bosch-scholar",
    title: "Bosch Scholar",
    description: "Nhận học bổng 'Give Wings To Your Dream' từ Bosch Global Software",
    icon: "🏆",
    unlocked: true,
    color: "from-amber-400 to-yellow-500",
  },
  {
    id: "viethope-creator",
    title: "VietHope Ambassador",
    description: "3+ năm cống hiến Designer, Editor và cải tiến Web Portal viethope.org",
    icon: "⭐",
    unlocked: true,
    color: "from-rose-400 to-red-600",
  },
];

export const JOURNAL_POSTS: JournalPost[] = [
  {
    id: "ortho-experience",
    title: "Hành trình Xây dựng Giao diện Thương mại Điện tử & Chatbot AI tại Ortho Fashion",
    date: "Tháng 02/2026",
    readTime: "5 phút đọc",
    category: "Frontend & Web Development",
    summary: "Những bài học thực chiến khi phát triển website sản xuất: thiết kế giao diện đăng nhập thân thiện, kết nối ví Web3 MetaMask, tích hợp Chatbot AI và tối ưu hóa hiệu năng tải trang đa thiết bị.",
    content: "Làm việc tại Ortho Fashion với tư cách Front-end Developer đã rèn luyện cho tôi tư duy kiến trúc component có khả năng tái sử dụng cao, quy trình làm việc Agile chuyên nghiệp và cách kết nối mượt mà giữa RESTful APIs với các công nghệ tương tác hiện đại như Three.js và AI.",
    likes: 428
  },
  {
    id: "stem-kidspire",
    title: "Lan tỏa Tri thức STEM & Giáo dục Cảm xúc (SEL) cho hơn 740 Thanh Thiếu Niên",
    date: "Tháng 12/2025",
    readTime: "6 phút đọc",
    category: "STEM & Social Impact",
    summary: "Câu chuyện điều phối chương trình giáo dục 18 tháng tại Kidspire Vietnam: mang khoa học kỹ thuật và kỹ năng tự nhận thức cảm xúc đến với các mái ấm và trường học cộng đồng.",
    content: "Giáo dục không chỉ là truyền đạt lý thuyết mà còn là khơi gợi niềm đam mê và lòng thấu cảm. Đứng lớp hơn 30 giờ SEL và tập huấn cho phụ huynh, người chăm sóc giúp tôi hiểu sâu sắc giá trị của cách tiếp cận lấy con người làm trọng tâm trong mọi sản phẩm công nghệ.",
    likes: 562
  },
  {
    id: "thesis-vton",
    title: "Khóa luận Tốt nghiệp: Đột phá với Hệ thống Thử Đồ Ảo (VTON) và Deep Learning",
    date: "Tháng 07/2025",
    readTime: "8 phút đọc",
    category: "Computer Vision & AI",
    summary: "Tổng kết nghiên cứu cải tiến CatVTON và thuật toán chỉnh sửa màu trang phục bằng ngôn ngữ tự nhiên (NLP) đạt điểm số xuất sắc tại HCMUS.",
    content: "Bằng cách kết hợp mô hình phân đoạn ngữ nghĩa DeepLabV3, trích xuất màu sắc qua NLP và chuyển đổi không gian màu HSV, hệ thống cho phép người dùng tùy biến trang phục theo ý muốn với chi phí tính toán được tối ưu đáng kể so với các phương pháp truyền thống.",
    likes: 619
  }
];

export const INSPIRATIONAL_NOTES = [
  "Biến ý tưởng và dòng lệnh thành giá trị thực tiễn cho người dùng. 💻",
  "Tận tâm, trách nhiệm và hướng đến sự hoàn thiện trong từng chi tiết. 🌸",
  "Kết nối công nghệ hiện đại với tư duy lấy con người làm trung tâm. ✨",
  "Học hỏi không ngừng là chiếc chìa khóa vạn năng để vươn xa. 🚀",
  "Đóng góp cho cộng đồng chính là cách nuôi dưỡng tâm hồn trọn vẹn nhất. 💖"
];
