import * as motion from "motion/react-client";

const SecondSVGSeparator = () => {
  return (
    <div className="flex justify-center items-center py-4 md:py-8 lg:py-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="4"
        height="152"
        viewBox="0 0 4 157"
        fill="none"
      >
        <motion.path
          d="M2 2V155"
          stroke="url(#paint0_linear_75_642)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.5, ease: "linear", delay: 0.25 }}
        />
        <defs>
          <linearGradient
            id="paint0_linear_75_642"
            x1="-29"
            y1="-113"
            x2="2.88539"
            y2="157.052"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.465" stopColor="#1976D2" />
            <stop offset="1" stopColor="#A3D5FF" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default SecondSVGSeparator;
