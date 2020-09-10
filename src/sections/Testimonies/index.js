import React from "react";
import Carousel from "antd";

const Testimonies = ({ testimonies }) =>
	<section className="testimonies">
		<Carousel autoplay>
			{
				testimonies.map((tt) =>
					<Card
						cover={ tt.avatar }
					>
						{ tt.quote }
						<strong>- { tt.author }</strong>
					</Card>
				)
			}
		</Carousel>
	</section>

export default Testimonies;
