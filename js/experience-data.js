
/* ===== DATA EXPERIENCE =====
   Edit this file only to update the Experience page content.

   - Text WITHOUT "[Placeholder]" is taken from your previous index.html.
   - Text containing "[Placeholder]" MUST be replaced before publishing.
   - Empty fields ("" or []) are automatically hidden.

   Logo  : Set `logo: "assets/exp/name.png"`. If empty, the initial from `mark` is displayed.
   Photos: Replace ph("Label", 210) with { src: "assets/exp/photo1.jpg", caption: "Description" }.
           ph() is only a temporary image generator. */

(function () {
  function ph(label, hue) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="hsl(' + hue + ',80%,34%)"/>' +
      '<stop offset="1" stop-color="hsl(' + (hue + 40) + ',85%,13%)"/></linearGradient></defs>' +
      '<rect width="800" height="500" fill="url(#g)"/>' +
      '<circle cx="650" cy="110" r="160" fill="#fff" opacity=".06"/>' +
      '<circle cx="130" cy="430" r="120" fill="#fff" opacity=".05"/>' +
      '<text x="400" y="262" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" fill="#d6e8ff" opacity=".85">' +
      label + '</text></svg>';
    return { src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg), caption: label };
  }

  window.EXPERIENCE_DATA = {

    /* ---------- ORGANIZATIONS ---------- */
    organizations: [
      {
        mark: "KR",
        logo: "assets/exp/logokroeng.jpeg",
        name: "KROENG",
        institution: "Interdisciplinary research community: robotics, electrical engineering and IoT",
        role: "Member of Programming",
        period: "Sep 2023 – Feb 2025",
        short: "Contributed to collaborative programming projects, technical discussions, and the exploration of robotics and IoT technologies.",
        overview: "KROENG is an interdisciplinary student community at Universitas Syiah Kuala focused on robotics, electrical engineering, programming, and Internet of Things (IoT). The community provides a collaborative environment for members to develop technical skills, explore innovative technologies, and work on engineering projects.",
        contributions: [
          "Took part in 10+ technical discussions and programming sessions, exploring practical applications of programming in robotics and engineering.",
          "Worked alongside 5+ fellow members on 3 collaborative projects involving programming and robotics.",
          "Explored and experimented with 4+ technologies related to robotics, microcontrollers, and Internet of Things (IoT) applications.",
          "Shared technical insights and worked through programming challenges during regular team discussions and learning sessions."     
        ],
        achievements: [],
        skills: ["Teamwork", "Programming", "Robotics", "Research Coordination", "Internet of Things (IoT)", "Problem Solving", "Critical Thinking"],
        gallery: [
        { src: "assets/exp/kroeng-1.jpeg", caption: "" },
        { src: "assets/exp/kroeng-2.jpeg", caption: "" },
        { src: "assets/exp/kroeng-3.jpeg", caption: "" }]
      },
      {
        mark: "BEM",
        logo: "assets/exp/logobemteknik.jpeg",
        name: "Student Executive Board",
        institution: "Faculty of Engineering, Syiah Kuala University",
        role: "Member of the Talent Department",
        period: "Feb 2024 – Jan 2025",
        short: "Supported talent development programs through event planning and student engagement.",
        overview: "The Student Executive Board of the Faculty of Engineering (BEM FT) at Universitas Syiah Kuala is a student organization that serves as a platform for student representation, leadership development, and community engagement. It focuses on fostering student development, facilitating collaboration, and organizing initiatives that support the academic and non-academic growth of engineering students.",
        contributions: [
          "Contributed to 3 student development programs focused on exploring and nurturing students' interests and talents.",
          "Collaborated with 8 department members to plan and coordinate talent development initiatives.",
          "Supported the organization of 5 faculty events to encourage student participation and engagement.",
          "Helped facilitate activities involving 100+ students, promoting creativity, collaboration, and personal development."
        ],
        achievements: [],
        skills: ["Leadership", "Event Management", "Communication", "Program Planning", "Time Management", "Problem Solving", "Creative Thinking", "Cross-team Coordination"],
        gallery: [
        { src: "assets/exp/fotobem.jpeg", caption: "" },
        { src: "assets/exp/sertifikatbem.jpeg", caption: "" }]
      },
      {
        mark: "HME",
        logo: "assets/exp/logohimatektro.jpeg",
        name: "Electrical Engineering Student Association",
        institution: "Syiah Kuala University",
        role: "Member of the Talent Department",
        period: "Jan 2022 – Dec 2023",
        short: "Contributed to student engagement and organizational activities within the Electrical Engineering community.",
        overview: "The Electrical Engineering Student Association (HIMATEKTRO) at Universitas Syiah Kuala is a student organization that represents Electrical Engineering students and provides opportunities for leadership, collaboration, and personal development. It serves as a platform for students to build connections, participate in organizational activities, and develop their academic and non-academic interests.",
        contributions: [
        "Assisted in preparing and carrying out 4+ departmental activities, helping ensure that student programs ran smoothly.",
        "Connected with 6+ fellow committee members to exchange ideas and handle responsibilities throughout the organizational period.",
        "Took an active role in supporting 3+ student engagement initiatives, encouraging participation in the Electrical Engineering community.",
        "Helped manage activity preparations, internal communication, and follow-up tasks to keep departmental work organized."
        ],
        achievements: [],
        skills: ["Teamwork", "Event Management", "Communication", "Problem Solving", "Creative Thinking", "Organizational Skills", "Decision Making", "Conflict Resolution"],
        gallery: [
        { src: "assets/exp/elektro1.jpeg", caption: "" },
        { src: "assets/exp/elektro2.jpeg", caption: "" },
        { src: "assets/exp/elektro3.jpeg", caption: "" },
        { src: "assets/exp/elektro4.jpeg", caption: "" },
        { src: "assets/exp/elektro5.jpeg", caption: "" }
      ]
      }
    ],

    /* ---------- WORK EXPERIENCE ---------- */
    work: [
      {
        mark: "USK",
        logo: "assets/logousk.png",
        company: "Syiah Kuala University",
        role: "Control Systems and Robotics Laboratory Assistant",
        period: "Feb 2024 – Jul 2025",
        location: "Banda Aceh",
        short: "Taught control system concepts through practical experiments and MATLAB simulations.",
        overview: "Supported control systems laboratory activities by assisting students in applying control theory, analyzing system responses, and conducting practical experiments using MATLAB.",
        responsibilities: [
          "Guided 100+ students through 6 practical modules covering control system fundamentals, transient response, root locus, and Bode plot analysis.",
          "Conducted practical demonstrations of P and I controllers in closed-loop systems, helping students understand controller behavior and system performance.",
          "Assisted students in experimenting with discontinuous controllers and observing their effects on system responses.",
          "Explained simulation results and helped students connect theoretical control concepts with practical engineering applications.",
          "Supported MATLAB-based experiments, troubleshooting, and interpretation of control system simulation results."
        ],
        tech: ["MATLAB", "Simulink"], /* Add Simulink or other tools only if they were actually used */
        results: [],
        showcase: [
        { src: "assets/exp/kendali1.jpeg", caption: "" },
        { src: "assets/exp/kendali2.jpeg", caption: "" },
        { src: "assets/exp/kendali3.jpeg", caption: "" },
        { src: "assets/exp/kendali4.jpeg", caption: "" }
        ]
      },
      {
        mark: "USK",
        logo: "assets/logousk.png",
        company: "Syiah Kuala University",
        role: "Digital Signal Processing Laboratory Assistant",
        period: "Aug 2024 – Dec 2024",
        location: "Banda Aceh",
        short: "Guided signal processing experiments using MATLAB and Python, covering LTI systems, DFT, and digital filtering.",
        overview: "Assisted students in understanding digital signal processing concepts through laboratory sessions, practical demonstrations, and hands-on experiments involving signal analysis and digital filtering.",
        responsibilities: [
          "Delivered instruction to 70+ students across 4 practical modules, covering fundamental concepts and applications of digital signal processing.",
          "Guided hands-on experiments on discrete-time Linear Time-Invariant (LTI) systems, focusing on time-domain analysis.",
          "Taught practical concepts of the Discrete Fourier Transform (DFT) and frequency-domain signal analysis.",
          "Demonstrated digital filtering techniques using MATLAB and Python for signal processing experiments.",
          "Assisted students in troubleshooting programming errors and interpreting laboratory results."

        ],
        tech: ["MATLAB", "Python", "NumPy", "SciPy", "Matplotlib"], 
        results: [],
        showcase: [
        { src: "assets/exp/dsp1.jpeg", caption: "" },
        { src: "assets/exp/dsp2.jpeg", caption: "" }]
      },
      {
        mark: "TLK",
        logo: "assets/exp/logotelkom.png",
        company: "Telkom Witel",
        role: "Data Management",
        period: "Dec 2023 – Jan 2024",
        location: "Banda Aceh",
        short: "Handled IndiHome customer records by reviewing, verifying, and updating data to maintain accuracy and consistency.",
        overview: "Data management internship focused on maintaining accurate, complete, and consistent IndiHome customer records to support daily operational activities.",
        responsibilities: [
          "Reviewed and verified 1000+ IndiHome customer records to check the accuracy and completeness of customer information.",
          "Updated 300+ customer records to correct outdated or inconsistent information in the database.",
          "Cross-checked customer details across multiple data fields to identify discrepancies and maintain record consistency.",
          "Organized and managed customer data using Microsoft Excel, making records easier to review and process."
        ],
        tech: ["Excel", "Word", "DAVA", "UIM Tools"],
        results: [],
        showcase: [
        { src: "assets/exp/telkom1.jpeg", caption: "" },
        { src: "assets/exp/telkom2.jpeg", caption: "" },
        { src: "assets/exp/telkom3.jpeg", caption: "" },
        { src: "assets/exp/telkom4.jpeg", caption: "" }]
      }
    ]
  };
})();
