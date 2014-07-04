--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: daemonburrito_blog; Tablespace: 
--

CREATE TABLE posts (
    creation_date date,
    published_date date,
    body text,
    path character varying(80),
    title character varying(80),
    posts_id integer NOT NULL
);


ALTER TABLE public.posts OWNER TO daemonburrito_blog;

--
-- Name: posts_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: daemonburrito_blog
--

CREATE SEQUENCE posts_posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_posts_id_seq OWNER TO daemonburrito_blog;

--
-- Name: posts_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: daemonburrito_blog
--

ALTER SEQUENCE posts_posts_id_seq OWNED BY posts.posts_id;


--
-- Name: posts_id; Type: DEFAULT; Schema: public; Owner: daemonburrito_blog
--

ALTER TABLE ONLY posts ALTER COLUMN posts_id SET DEFAULT nextval('posts_posts_id_seq'::regclass);


--
-- Name: posts_pkey; Type: CONSTRAINT; Schema: public; Owner: daemonburrito_blog; Tablespace: 
--

ALTER TABLE ONLY posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (posts_id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

