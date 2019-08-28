--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.12
-- Dumped by pg_dump version 9.6.12

-- Started on 2019-08-26 10:00:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2192 (class 0 OID 27039)
-- Dependencies: 186
-- Data for Name: Alimentacions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Alimentacions" VALUES (1, 'Carnivoro', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03');
INSERT INTO public."Alimentacions" VALUES (2, 'Herbivoro', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03');
INSERT INTO public."Alimentacions" VALUES (3, 'Omnivoro', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03');


--
-- TOC entry 2212 (class 0 OID 0)
-- Dependencies: 185
-- Name: Alimentacions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Alimentacions_id_seq"', 3, true);


--
-- TOC entry 2194 (class 0 OID 27047)
-- Dependencies: 188
-- Data for Name: Clases; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Clases" VALUES (1, 'Saurirsquios', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03');
INSERT INTO public."Clases" VALUES (2, 'Ornitisquios', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03');


--
-- TOC entry 2213 (class 0 OID 0)
-- Dependencies: 187
-- Name: Clases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Clases_id_seq"', 2, true);


--
-- TOC entry 2198 (class 0 OID 27068)
-- Dependencies: 192
-- Data for Name: Periodos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Periodos" VALUES (1, 'Jurasico', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03');
INSERT INTO public."Periodos" VALUES (2, 'Cretacico', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03');
INSERT INTO public."Periodos" VALUES (3, 'Triasico', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03');


--
-- TOC entry 2196 (class 0 OID 27055)
-- Dependencies: 190
-- Data for Name: SubClases; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."SubClases" VALUES (1, 'Teropodos', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 1);
INSERT INTO public."SubClases" VALUES (2, 'Sauropodos', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 1);
INSERT INTO public."SubClases" VALUES (3, 'Anquilosaurios', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 2);
INSERT INTO public."SubClases" VALUES (4, 'Estegosaurios', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 2);
INSERT INTO public."SubClases" VALUES (5, 'Ceratopsianos', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 2);
INSERT INTO public."SubClases" VALUES (6, 'Ornitopodos', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 2);
INSERT INTO public."SubClases" VALUES (7, 'Paquicefalosaurios', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 2);


--
-- TOC entry 2200 (class 0 OID 27076)
-- Dependencies: 194
-- Data for Name: Dinosaurios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Dinosaurios" VALUES (1, 'Dinoreloco de bd', '2012-01-01 00:00:00-03', '2013-01-01 00:00:00-03', 1, 1, 1);


--
-- TOC entry 2214 (class 0 OID 0)
-- Dependencies: 193
-- Name: Dinosaurios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Dinosaurios_id_seq"', 1, true);


--
-- TOC entry 2202 (class 0 OID 27099)
-- Dependencies: 196
-- Data for Name: TipoHuesos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."TipoHuesos" VALUES (2, 'Axial', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03');
INSERT INTO public."TipoHuesos" VALUES (3, 'Apendicular', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03');


--
-- TOC entry 2204 (class 0 OID 27107)
-- Dependencies: 198
-- Data for Name: SubTipoHuesos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."SubTipoHuesos" VALUES (2, 'Torax', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 2);
INSERT INTO public."SubTipoHuesos" VALUES (3, 'Vertebral', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 2);
INSERT INTO public."SubTipoHuesos" VALUES (4, 'Craneo', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 2);
INSERT INTO public."SubTipoHuesos" VALUES (5, 'Pelvis', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 2);
INSERT INTO public."SubTipoHuesos" VALUES (6, 'Brazo', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 3);
INSERT INTO public."SubTipoHuesos" VALUES (7, 'Manos', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 3);
INSERT INTO public."SubTipoHuesos" VALUES (8, 'Piernas', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 3);
INSERT INTO public."SubTipoHuesos" VALUES (9, 'Pies', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 3);


--
-- TOC entry 2206 (class 0 OID 27120)
-- Dependencies: 200
-- Data for Name: Huesos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Huesos" VALUES (2, 'Torax de Tiranosaurio', '2012-01-01 00:00:00-03', '2012-01-01 00:00:00-03', 1, 2);


--
-- TOC entry 2215 (class 0 OID 0)
-- Dependencies: 199
-- Name: Huesos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Huesos_id_seq"', 2, true);


--
-- TOC entry 2216 (class 0 OID 0)
-- Dependencies: 191
-- Name: Periodos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Periodos_id_seq"', 3, true);


--
-- TOC entry 2217 (class 0 OID 0)
-- Dependencies: 189
-- Name: SubClases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SubClases_id_seq"', 7, true);


--
-- TOC entry 2218 (class 0 OID 0)
-- Dependencies: 197
-- Name: SubTipoHuesos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SubTipoHuesos_id_seq"', 9, true);


--
-- TOC entry 2219 (class 0 OID 0)
-- Dependencies: 195
-- Name: TipoHuesos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TipoHuesos_id_seq"', 3, true);


-- Completed on 2019-08-26 10:00:35

--
-- PostgreSQL database dump complete
--

