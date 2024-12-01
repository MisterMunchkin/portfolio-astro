import type { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

type Props<TData> = {
    data: TData[];
    render: (item: TData) => ReactNode;
};

const ReactSwiper = <TData,>({ data, render }: Props<TData>) => {
    return (
        <Swiper
            className="py-4"
            navigation
            scrollbar={{ draggable: true }}
            modules={[Navigation, Scrollbar, A11y]}
            spaceBetween={20}
            slidesPerView={2}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            style={{ paddingBottom: "50px" }}
        >
            {data.map((item, index) => (
                <SwiperSlide key={index}>{render(item)}</SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ReactSwiper;
