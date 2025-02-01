import Image from "next/image";

const Partner = () => {
  return (
    <section className="relative bg-white py-10 mt-10 rounded-3xl overflow-x-hidden">
      <div className="sd:px-8 xz:px-5">
        <h4 className="text-2xl sd:text-4xl font-bold sd:mb-12 xz:mb-2 text-gray-700 shadow-text">
          Наши партнёры
        </h4>

        <div className="grid sd:grid-cols-4 xz:grid-cols-2 justify-center sd:gap-10 xz:gap-2">
          {[
            '/partner/1.png',
            '/partner/2.png',
            '/partner/3.png',
            '/partner/4.png',
            '/partner/5.png',
            '/partner/6.png',
            '/partner/7.png',
          ].map((src, index) => (
            <div key={index} className="sd:w-40 h-40 xz:w-32 xz:h-32 flex items-center justify-center">
              <Image 
                src={src} 
                alt={`Наши партнёры по кредиту и лизингу ${index + 1}`} 
                width={200} 
                height={200} 
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partner;
