import React, { useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import Carousell from "re-carousel";
import Carouselll from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Parser from "rss-parser";

const Section1 = () => {
  const [axis, setaxis] = useState("y");
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadNews();
  }, []);

  const parser = new Parser();
  const CORS_PROXY = "https://thingproxy.freeboard.io/fetch/";

  async function loadNews() {
    try {
      const feed = await parser.parseURL(
        CORS_PROXY +
          "http://www.industry.gov.lk/web/index.php/en/component/ninjarsssyndicator/?feed_id=2&format=raw"
      );
      setItems(feed.items);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Container>
        <Row className="p-3">
          <Col
            xs={12}
            md={3}
            lg={3}
            className="border border-primary p-0 overflow-hidden"
          >
            <Card.Header as="h5" className="">
              Latest News
            </Card.Header>

            <Carousell auto loop axis={axis}>
              {items.map((item, key) => (
                <div style={{ height: "100%" }} key={key}>
                  <Card className="text-center" border={"light"}>
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text
                        dangerouslySetInnerHTML={{
                          __html: item.content,
                        }}
                      ></Card.Text>
                      <Card.Text>
                        <small className="text-muted">
                          {item.isoDate.split("T")[0] +
                            " at " +
                            item.isoDate.match(/\d\d:\d\d/)}
                        </small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Carousell>
          </Col>
          <Col xs={12} md={9} lg={9}>
            <div>
              <Carouselll>
                <Carouselll.Item>
                  <img
                    className="d-block w-100"
                    src="http://www.industry.gov.lk/web/images/resized/images/stories/slider/1_711_326.jpg"
                    alt="First slide"
                  />
                </Carouselll.Item>
                <Carouselll.Item>
                  <img
                    className="d-block w-100"
                    src="http://www.industry.gov.lk/web/images/resized/images/stories/slider/3_711_326.jpg"
                    alt="Third slide"
                  />
                </Carouselll.Item>
                <Carouselll.Item>
                  <img
                    className="d-block w-100"
                    src="http://www.industry.gov.lk/web/images/resized/images/stories/slider/2_711_326.jpg"
                    alt="Third slide"
                  />
                </Carouselll.Item>
              </Carouselll>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Section1;
