import * as motion from "motion/react-client";

const FirstSvgSeparator = () => {
  return (
    <div className="flex justify-center items-center py-4 md:py-8 lg:py-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="160"
        height="152"
        viewBox="0 0 160 152"
        fill="none"
      >
        <motion.path
          d="M2 2V64.5C2 166.5 158 43.5 158 150.5"
          stroke="url(#paint0_linear_75_640)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, ease: "linear", delay: 0.25 }}
        />
        <defs>
          <linearGradient
            id="paint0_linear_75_640"
            x1="-24.6611"
            y1="9.38694"
            x2="69.9898"
            y2="204.039"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.005" stopColor="#A3D5FF" stopOpacity="0.2" />
            <stop offset="0.465" stopColor="#1976D2" />
            <stop offset="1" stopColor="#F6B600" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default FirstSvgSeparator;
