import React from "react";
import { Col, Row, Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";

const Section2 = () => {
  return (
    <div>
      <Container>
        <Row className="p-3">
          <Col xs={12} md={9} lg={9}>
            <CardColumns>
              <Card>
                <Card.Img
                  variant="top"
                  src="http://www.industry.gov.lk/web/images/stories/new/modules/industry-m.jpg"
                />
                <Card.Body>
                  <Card.Text>
                    <span className="">Research and Development</span>
                    <br />
                    <span>Common Facility Centers</span>
                    <br />
                    <span className="p-0 mb-2">Value Chain Development</span>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Img
                  variant="top"
                  src="http://www.industry.gov.lk/web/images/stories/new/modules/industry-2.jpg"
                />
                <Card.Body>
                  <Card.Text>
                    <span>Regional Industrial Development Programme</span>
                    <br />
                    <br />
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Img
                  variant="top"
                  src="http://www.industry.gov.lk/web/images/stories/new/modules/industry-3.jpg"
                />
                <Card.Body>
                  <Card.Text>
                    <span>Current Business Strategy</span>
                    <br />
                    <br />
                    <br />
                  </Card.Text>
                </Card.Body>
              </Card>
            </CardColumns>
          </Col>
          <Col xs={12} md={3} lg={3} className="border border-primary p-0">
            <Card.Header as="h5" className="">
              Investment Opportunities
            </Card.Header>

            <Card.Img
              variant="top"
              src="http://www.industry.gov.lk/web/images/stories/new/map.jpg"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Section2;
