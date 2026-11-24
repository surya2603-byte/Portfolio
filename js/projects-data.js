window.PROJECTS = [
  {
    id: "eeg-vmd-butterworth",
    title: "EEG Signal Denoising: VMD vs Butterworth Filter",
    cardSummary: "A comparison of VMD and Butterworth filtering for EEG noise reduction.",
    category: "Artificial Intelligence",
    shortDescription: "A comparative analysis of Variational Mode Decomposition and Butterworth filtering for improving the quality of EEG recordings.",
    fullDescription: "This study examines two approaches to EEG signal denoising, Variational Mode Decomposition (VMD) and Butterworth filtering. Both methods were implemented in Python and evaluated using the same EEG dataset to compare their performance in reducing noise while maintaining signal quality. The findings were published in the International Journal of Electrical Engineering and Emerging Technologies (IJEEEMI), an accredited SINTA 2 journal.",
    year: "2025",
    client: "Academic Research",
    technologies: ["Python"],
    thumbnail: "assets/exp/eeg1.jpeg",
    heroImage: "assets/exp/eeg1.jpeg",
    gallery: [
        { src: "assets/exp/eeg2.jpeg", alt: "Deskripsi singkat foto" },
        { src: "assets/exp/eeg3.jpeg", alt: "Deskripsi singkat foto" },
        { src: "assets/exp/eeg4.jpeg", alt: "Deskripsi singkat foto" },
        { src: "assets/exp/eeg5.jpeg", alt: "Deskripsi singkat foto" },
        { src: "assets/exp/eeg6.jpeg", alt: "Deskripsi singkat foto" },
        { src: "assets/exp/eeg7.jpeg", alt: "Deskripsi singkat foto" }

    ],
    challenge: "EEG recordings often contain unwanted noise and artifacts that can interfere with the analysis of brain signals. These disturbances make it difficult to obtain clean data, highlighting the need for filtering methods that can improve signal quality without losing important information.",
    solution: "Implemented two denoising approaches, Variational Mode Decomposition (VMD) and Butterworth filtering, using Python. Both methods were applied to the same EEG dataset, allowing their performance to be compared under consistent conditions using several signal quality metrics.",
    features: [
      "EEG data preprocessing and signal analysis using Python",
      "Implementation of Variational Mode Decomposition (VMD)",
      "Butterworth Band-Pass Filtering for noise reduction",
      "Performance evaluation using MAE, MSE, RMSE, and SNR"
    ],
    result: "VMD achieved better denoising performance than the Butterworth Band-Pass Filter. For Subject 1, VMD recorded an MAE of 0.26 and MSE of 0.42, compared to 13.72 and 674.96 with BPF. For Subject 3, VMD achieved an RMSE of 0.40, compared to 25.90 with BPF. The highest SNR reached 28.56 dB with VMD, compared to 2.43 dB with BPF. The findings were published in IJEEEMI, an accredited SINTA 2 journal.",
    link: { label: "Read the paper (DOI)", url: "https://doi.org/10.35882/ijeeemi.v7i3.105" }
  },

  
  {
    id: "project-2",
    title: "MRI-Based Cardiac Image Segmentation Using Deep Learning",
    cardSummary: "Segmenting cardiac MRI images using a ResNet50-based deep learning model.",
    category: "AI & Deep Learning",
    shortDescription: "Applying ResNet50 to identify and segment key cardiac structures in MRI images.",
    fullDescription: "This project explores deep learning techniques for segmenting cardiac structures from MRI images. A ResNet50-based architecture was implemented to identify and separate key heart regions, including the right ventricle, left ventricle, and myocardium. The model was developed using Python and PyTorch, with performance evaluated through image segmentation metrics.",
    year: "2024",
    client: "Academic Project",
    technologies: ["Python", "PyTorch", "ResNet50"],
    thumbnail: "assets/exp/mri4.jpeg",
    heroImage: "assets/exp/mri4.jpeg",
    gallery: [
        { src: "assets/exp/mri1.png", alt: "Deskripsi singkat foto" },
        { src: "assets/exp/mri2.png", alt: "Deskripsi singkat foto" },
        { src: "assets/exp/mri3.jpeg", alt: "Deskripsi singkat foto" }
    ],
    challenge: "Identifying cardiac structures in MRI images requires accurate separation of regions with different shapes and boundaries. Variations in image characteristics make automated segmentation challenging, particularly when distinguishing the ventricular chambers and myocardium.",
    solution: "Developed a deep learning-based image segmentation model using a ResNet50 architecture. The model was trained on MRI images and their corresponding segmentation masks to identify three cardiac regions. Training parameters were also evaluated to determine a suitable configuration for segmentation performance.",
    features: [
      "MRI image preprocessing and dataset preparation",
      "ResNet50-based deep learning architecture",
      "Segmentation of the right ventricle, left ventricle, and myocardium",
      "Hyperparameter optimization for learning rate, batch size, and optimizer",
      "Model evaluation using Intersection over Union (IoU) and Dice Coefficient"
    ],
    result: "The model achieved its best average segmentation performance with a batch size of 4, recording an IoU of 0.434 and a Dice Coefficient of 0.559. Among the three cardiac regions, the myocardium achieved the highest Dice score of 0.627. These results indicate that batch size 4 provided the strongest segmentation performance among the configurations evaluated."
  },

  {
    id: "project-3",
    title: "IoT-Based Indoor Air Quality Monitoring and Purification System",
    cardSummary: "An automated system for detecting and reducing indoor air pollutants.",
    category: "IoT & Embedded Systems",
    shortDescription: "An ESP32-based system integrating gas and dust sensors for real-time air quality monitoring and automatic ventilation.",
    fullDescription: "This project focuses on developing an IoT-based system for monitoring indoor air quality and automatically removing smoke and dust. Built around an ESP32 microcontroller, the system uses an MQ-7 sensor to detect carbon monoxide and a GP2Y1010AU0F sensor to measure dust concentration. Sensor readings are transmitted to the Blynk IoT application, allowing users to monitor air conditions in real time. An exhaust fan is activated automatically when detected pollution levels exceed predefined thresholds.",
    year: "2024",
    client: "Academic Project",
    technologies: ["ESP32", "Arduino IDE", "Blynk IoT"],
    thumbnail: "assets/exp/debu3.jpeg",
    heroImage: "assets/exp/debu3.jpeg",
    gallery: [
        { src: "assets/exp/debu1.jpeg", alt: "Deskripsi singkat foto" },
        { src: "assets/exp/debu2.jpeg", alt: "Deskripsi singkat foto" },
        { src: "assets/exp/debu3.jpeg", alt: "Deskripsi singkat foto" },
        { src: "assets/exp/debu4.jpeg", alt: "Deskripsi singkat foto" },
        { src: "assets/exp/debuvideo.mp4", poster: "assets/exp/debu5.jpeg", alt: "Rekaman proses segmentasi" }
    ],
    challenge: "Indoor air pollution can go unnoticed without continuous monitoring, particularly when smoke, carbon monoxide, and dust accumulate in enclosed spaces. Manual inspection makes it difficult to track changing air conditions and respond quickly when pollution levels increase.",
    solution: "Developed an integrated monitoring and ventilation system using an ESP32 microcontroller and two air quality sensors. Sensor readings are processed to determine air conditions, while a relay controls the exhaust fan based on predefined thresholds. The system also sends sensor data to Blynk IoT, providing real-time monitoring through a smartphone.",
    features: [
      "Real-time carbon monoxide detection using the MQ-7 sensor",
      "Dust concentration monitoring using the GP2Y1010AU0F sensor",
      "Wireless sensor data transmission through ESP32 and Blynk IoT",
      "Automatic exhaust fan activation based on sensor readings",
      "Three-level air quality indicators using green, yellow, and red LEDs"
    ],
    result: "The system successfully monitored indoor air conditions and controlled the exhaust fan based on sensor readings. Wireless data transmission through Blynk IoT remained reliable up to 13 meters, with a response time of 0.5–1 second and 0% transmission error. Testing also confirmed that the fan responded correctly to the OR logic between the MQ-7 and dust sensors, activating whenever either sensor detected pollution above its threshold."
  },

    {
    id: "project-4",
    title: "BrainBoost – Digital Learning Platform",
    cardSummary: "A web-based learning platform for junior high school students.",
    category: "Web Development",
    shortDescription: "A web-based learning platform with dedicated dashboards for administrators, teachers, and students.",
    fullDescription: "BrainBoost is a web-based e-learning platform designed to support digital education for junior high school students. The platform provides separate access for administrators, teachers, and students, each with dedicated features to support learning management. Administrators can manage student records, teachers, classes, subjects, and academic years, while teachers can upload learning materials and assignments. Students can access their subjects, view lessons, and study materials through a structured dashboard. The project focuses on making learning resources easier to manage and access through a centralized digital platform.",
    year: "2024",
    client: "Academic Project",
    technologies: ["HTML", "PHP", "MySQL", "Figma"],
    thumbnail: "assets/exp/brain5.jpeg",
    heroImage: "assets/exp/brain5.jpeg",
    gallery: [
        { src: "assets/exp/brain1.jpeg", alt: "Keterangan foto 1" },
        { src: "assets/exp/brain2.jpeg", alt: "Keterangan foto 2" },
        { src: "assets/exp/brain3.jpeg", alt: "Keterangan foto 2" },
        { src: "assets/exp/brain4.jpeg", alt: "Keterangan foto 2" },
        { src: "assets/exp/brain5.jpeg", alt: "Keterangan foto 2" }
    ],
    challenge: "Managing learning materials, student records, and classroom activities across different users can become difficult without a centralized platform. Students also need a more flexible way to access learning materials beyond traditional classroom sessions.",
    solution: "Designed a web-based e-learning platform with dedicated dashboards for administrators, teachers, and students. The system organizes academic data, allows teachers to upload learning materials and assignments, and provides students with direct access to their subjects and lessons through a centralized interface.",
    features: [
      "Role-based login for administrators, teachers, and students",
      "Student, teacher, class, and subject management",
      "Academic year and school data management",
      "Learning material and assignment uploads for teachers",
      "Student dashboards for accessing subjects and lessons",
      "Search functionality for navigating learning materials"
    ],
    result: "Successfully developed a web-based e-learning platform with dedicated dashboards for three user roles. The system supports academic data management, learning material uploads, and student access to lessons and assignments. Testing showed that key functions, including registration, login, data validation, and dashboard navigation, operated as expected, providing a more structured approach to digital learning."
  },

    {
    id: "project-5",
    title: "Wi-Fi Network Design and Performance Evaluation",
    cardSummary: "Designing and evaluating a Linux-based Wi-Fi network using an access point.",
    category: "Networking & Telecommunications",
    shortDescription: "Configuring a Linux-based access point and evaluating network performance across multiple clients.",
    fullDescription: "This project focuses on designing and evaluating a Wi-Fi network using a Linux-based access point. An Ubuntu PC was configured as an access point using Hostapd and Dnsmasq, allowing four client laptops to connect to the network. Network performance was evaluated using iPerf3 and ping, with particular attention to throughput, delay, and packet loss. The evaluation provided insights into connection quality and performance variations across different client devices.",
    year: "2024",
    client: "Academic Project",
    technologies: ["Linux", "Hostapd", "Dnsmasq", "iPerf3"],
    thumbnail: "assets/exp/nirkabel1.jpeg",
    heroImage: "assets/exp/nirkabel1.jpeg",
    gallery: [
        { src: "assets/exp/nirkabel1.jpeg", alt: "Keterangan foto 1" },
        { src: "assets/exp/nirkabel2.jpeg", alt: "Keterangan foto 2" },
        { src: "assets/exp/nirkabel3.jpeg", alt: "Keterangan foto 2" }

    ],
    challenge: "Wireless network performance can vary across connected devices due to differences in connection conditions, distance, and network interference. Without proper testing, it is difficult to identify performance variations and determine whether a network can provide stable connectivity for multiple clients.",
    solution: "Configured an Ubuntu-based PC to function as a wireless access point using Hostapd and Dnsmasq. Four client laptops were connected to the network and tested using iPerf3 and ping. The collected measurements were then analyzed to assess throughput, latency, and packet loss across all connected devices.",
    features: [
      "Linux-based Wi-Fi access point configuration",
      "Wireless network management using Hostapd and Dnsmasq",
      "Multi-client connectivity with four laptop devices",
      "Throughput measurement using iPerf3",
      "Network delay and packet loss analysis",
      "Comparative performance evaluation across clients"
    ],
    result: "The network achieved a maximum throughput of 13.2 Mbps on Client 3, while average delay ranged from 1 to 3 ms across all four clients. All clients recorded 0% packet loss, demonstrating stable data transmission during testing. These results confirmed that the Linux-based access point successfully supported simultaneous wireless connections."
  },

      {
    id: "project-6",
    title: "NeuroScan ASD – EEG-Based Brain Signal Monitoring",
    cardSummary: "An EEG-based innovation for monitoring human brain activity.",
    category: "AI & Healthcare Technology",
    shortDescription: "An EEG-based system designed to detect and monitor human brain signals, presented at the 15th AIC 2025 Innovation Product Exhibition.",
    fullDescription: "NeuroScan ASD is an EEG-based innovation designed to detect and monitor human brain activity through electrical signals. The project explores the application of brain signal technology in the context of Autism Spectrum Disorder (ASD). It was represented at the Innovation Product Exhibition during the 15th AIC 2025 at Universitas Syiah Kuala, providing an opportunity to introduce the innovation to an academic audience.",
    year: "2025",
    client: "Academic Innovation Project",
    technologies: ["EEG Signal Processing"],
    thumbnail: "assets/exp/scan1.jpeg",
    heroImage: "assets/exp/scan1.jpeg",
    gallery: [
        { src: "assets/exp/scan1.jpeg", alt: "Keterangan foto 1" },
        { src: "assets/exp/scan2.mp4", poster: "assets/exp/scan5.jpeg", alt: "Rekaman proses pemasangan" },
        { src: "assets/exp/scan3.mp4", poster: "assets/exp/scan5.jpeg", alt: "Rekaman kawasan expo" },
        { src: "assets/exp/scan4.jpg", alt: "Keterangan foto 2" }

    ],
    challenge: "Understanding human brain activity requires the ability to capture and interpret electrical signals. Making this information accessible through an innovative technology platform presents an important challenge in brain signal monitoring.",
    solution: "Introduced an EEG-based innovation designed to capture and monitor human brain signals, exploring its application in the context of Autism Spectrum Disorder research.",
    features: [
      "EEG-based brain signal detection",
      "Human brain activity monitoring",
      "Application in ASD-related research",
      "Brain signal technology demonstration"
    ],
    result: "NeuroScan ASD was successfully represented at the 15th AIC 2025 Innovation Product Exhibition, held on September 4–5, 2025, at Universitas Syiah Kuala. The participation was recognized with a Certificate of Appreciation."
  }

];