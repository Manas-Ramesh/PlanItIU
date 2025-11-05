-- ============================================
-- GENERATED SQL INSERT STATEMENTS
-- ============================================
-- Run this AFTER running supabase_schema.sql

-- ============================================
-- 1. INSERT DEGREES
-- ============================================

-- Accounting BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('Accounting BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;

-- BEPP: Econ Consulting BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('BEPP: Econ Consulting BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;

-- BEPP: Public Pol Anlys BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('BEPP: Public Pol Anlys BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;

-- Entreprenrshp & Corp Innov BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('Entreprenrshp & Corp Innov BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;

-- Finance BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('Finance BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;

-- Information Systems BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('Information Systems BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;

-- Management BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('Management BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;

-- Marketing BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('Marketing BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;

-- Marketing and Professional Sales BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('Marketing and Professional Sales BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;

-- Operations Management BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('Operations Management BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;

-- Real Estate BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('Real Estate BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;

-- Supply Chain Management BSB - Kelley School of Business
INSERT INTO degrees (major_name, school, degree_type)
VALUES ('Supply Chain Management BSB', 'Kelley School of Business', 'BSB')
ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;


-- ============================================
-- 2. INSERT COURSES
-- ============================================

INSERT INTO courses (course_code, course_name, credits, scheduled_terms)
VALUES
    ('CMLT-C 110', 'WRITING THE WORLD', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('ENG-W 131', 'READING, WRITING, AND INQUIRY I', '2–4', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('ENG-W 170', 'PROJECTS IN READING & WRITING (INTRODUCTION TO ARGUMENTATIVE WRITING)', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('ENG-W 171', 'PROJECTS IN DIGITAL LITERACY + COMPOSITION', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-C 104', 'BUSINESS PRESENTATIONS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-C 106', 'BUSINESS PRESENTATIONS-HONORS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('MATH-B 110', 'MATHEMATICS FOR BUSINESS AND PUBLIC AFFAIRS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('MATH-M 119', 'BRIEF SURVEY OF CALCULUS 1', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('MATH-M 211', 'CALCULUS I', '4', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('MATH-S 211', 'HONORS CALCULUS I', '4', ARRAY['Fall 2025']),
    ('BUS-A 100', 'INTRODUCTORY ACCOUNTING PRINCIPLES AND ANALYSIS', '1', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-T 175', 'KELLEY COMPASS 1', '1.5', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-T 176', 'COMPASS 1 HONORS', '1.5', ARRAY['Spring 2026']),
    ('BUS-K 201', 'FOUNDATIONS OF BUSINESS INFORMATION SYSTEMS AND DECISION MAKING', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-K 204', 'FOUNDATIONS OF BUSINESS INFORMATION SYSTEMS AND DECISION MAKING - HONORS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('ECON-B 251', 'FUNDAMENTALS OF ECONOMICS FOR BUSINESS I', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('ECON-S 251', 'FUNDAMENTALS OF ECONOMICS FOR BUSINESS I: HONORS', '3', ARRAY[]::TEXT[]),
    ('BUS-A 304', 'FINANCIAL REPORTING AND ANALYSIS', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-A 307', 'FINANCIAL REPORTING AND ANALYSIS: HONORS', '3', ARRAY['Fall 2025']),
    ('BUS-C 204', 'BUSINESS WRITING', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-C 205', 'BUSINESS WRITING: HONORS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-A 306', 'MANAGEMENT ACCOUNTING AND ANALYSIS', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-A 309', 'MANAGEMENT ACCOUNTING & ANALYSIS: HONORS', '3', ARRAY['Spring 2026']),
    ('ECON-E 370', 'STATISTICAL ANALYSIS FOR BUSINESS AND ECONOMICS', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('ECON-S 370', 'STATISTICAL ANALYSIS FOR BUSINESS AND ECONOMICS: HONORS', '3', ARRAY['Fall 2025']),
    ('MATH-M 365', 'INTRODUCTION TO PROBABILITY AND STATISTICS', '3–4', ARRAY['Fall 2025', 'Spring 2026']),
    ('STAT-S 301', 'APPLIED STATISTICAL METHODS FOR BUSINESS', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('STAT-S 350', 'INTRODUCTION TO STATISTICAL INFERENCE', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-D 270', 'THE GLOBAL BUSINESS ENVIRONMENTS', '1.5', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-G 202', 'BUSINESS, GOVERNMENT, AND SOCIETY', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-T 275', 'KELLEY COMPASS 2', '1.5', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-T 276', 'COMPASS 2 HONORS', '1.5', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-K 303', 'TECHNOLOGY AND BUSINESS ANALYSIS', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-K 304', 'TECHNOLOGY AND BUSINESS ANALYSIS - HONORS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-L 201', 'LEGAL ENVIRONMENT OF BUSINESS', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-L 293', 'HONORS - LEGAL ENVIRONMENT OF BUSINESS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-D 271', 'GLOBAL BUSINESS ANALYSIS-INTERNATIONAL BUSINESS MANAGEMENT', '1.5', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-T 271', 'GLOBAL BUSINESS ANALYSIS - PROFESSIONAL SKILLS', '1.5', ARRAY[]::TEXT[]),
    ('BUS-W 271', 'GLOBAL BUSINESS ANALYSIS - ENTREPRENEURSHIP & CORPORATE INNOVATION', '1.5', ARRAY[]::TEXT[]),
    ('BUS-A 311', 'INTERMEDIATE FINANCIAL REPORTING AND ANALYSIS I', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-BE 375', 'I-CORE F370/M370/P370/Z370', '12', ARRAY['Spring 2026', 'Summer 2026']),
    ('BUS-A 314', 'COMMUNICATING ACCOUNTING ANALYTICS', '1.5', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-A 312', 'INTERMEDIATE FINANCIAL REPORTING AND ANALYSIS II', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-A 329', 'TAXES AND DECISION MAKING', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-L 375', 'INTRODUCTION TO BUSINESS ETHICS', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-L 376', 'INTRODUCTION TO BUSINESS ETHICS HONORS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-A 325', 'COST AND PERFORMANCE MEASUREMENT FOR DECISION MAKING', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-A 424', 'FOUNDATIONS OF AUDITING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('ECON-B 252', 'FUNDAMENTALS OF ECONOMICS FOR BUSINESS II', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-A 337', 'ACCOUNTING INFORMATION SYSTEMS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-A 345', 'SUSTAINABILITY REPORTING AND ANALYSIS', '3', ARRAY['Spring 2026']),
    ('BUS-A 420', 'FINANCIAL STATEMENT ANALYSIS AND INTERPRETATION', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-A 422', 'ACCOUNTING FOR MERGERS, ACQUISITIONS, AND COMPLEX FINANCIAL STRUCTURES', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-A 437', 'ADVANCED MANAGEMENT ACCOUNTING FOR DECISION MAKING AND CONTROL: THEORY AND APPLICATIONS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-A 440', 'TECHNICAL AND EMPIRICAL RESEARCH IN ACCOUNTING', '3', ARRAY['Spring 2026']),
    ('BUS-T 375', 'KELLEY COMPASS 3', '1', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-J 375', 'STRATEGIC MANAGEMENT', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-Z 304', 'LEADERSHIP-HONORS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-G 350', 'BUSINESS ECONOMETRICS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-G 304', 'MANAGERIAL ECONOMICS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-G 303', 'GAME THEORY FOR BUSINESS STRATEGY', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-G 456', 'STRATEGY BEYOND MARKETS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-G 345', 'MONEY, BANKING AND CAPITAL MARKETS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-G 400', 'CAPSTONE IN ECONOMIC CONSULTING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-G 492', 'PREDICTIVE ANALYTICS FOR BUSINESS STRATEGY', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-W 212', 'EXPLORE ENTREPRENEURSHIP', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-W 235', 'IDEA VALIDATION & BUSINESS MODEL DEVELOPMENT', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-F 317', 'VENTURE CAPITAL AND ENTREPRENEURIAL FINANCE', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-W 313', 'NEW VENTURE PLANNING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-W 409', 'PRACTICUM IN ENTREPRENEURSHIP', '3', ARRAY['Spring 2026']),
    ('BUS-W 420', 'CORPORATE VENTURING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-D 411', 'INTERNATIONAL COMPETITIVE STRATEGY', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-J 355', 'STRUCTURED PROBLEM SOLVING FOR MANAGERS (TOPICS IN STRATEGIC MANAGEMENT)', '1–5', ARRAY['Spring 2026']),
    ('BUS-L 311', 'LAW FOR ENTREPRENEURS', '3', ARRAY[]::TEXT[]),
    ('BUS-M 422', 'NEW PRODUCT MANAGEMENT', '3', ARRAY[]::TEXT[]),
    ('BUS-W 326', 'SOCIAL ENTREPRENEURSHIP', '3', ARRAY['Spring 2026']),
    ('BUS-W 355', 'WOMEN AND THE ENTREPRENEURIAL CHALLENGE (TOPICS IN ENTREPRENEURSHIP & CORPORATE INNOVATION)', '1–5', ARRAY[]::TEXT[]),
    ('BUS-W 406', 'VENTURE GROWTH MANAGEMENT', '3', ARRAY[]::TEXT[]),
    ('BUS-Z 340', 'INTRODUCTION TO HUMAN RESOURCES', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-Z 404', 'EFFECTIVE NEGOTIATIONS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-Z 447', 'LEADERSHIP, TEAMWORK AND DIVERSITY', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-F 303', 'INTERMEDIATE INVESTMENTS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-F 305', 'INTERMEDIATE CORPORATE FINANCE', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-A 310', 'INTERMEDIATE FINANCIAL REPORTING AND ANALYSIS: A USER''S PERSPECTIVE', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-A 324', 'MANAGEMENT ACCOUNTING FOR FINANCE PROFESSIONALS', '1.5', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-F 307', 'WORKING CAPITAL MANAGEMENT', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-F 325', 'CRYPTOASSETS', '3', ARRAY['Spring 2026']),
    ('BUS-F 335', 'SECURITY TRADING AND MARKET MAKING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-F 355', 'APPLIED FINTECH (TOPICS IN FINANCE)', '1-5', ARRAY[]::TEXT[]),
    ('BUS-F 365', 'PERSONAL FINANCIAL PLANNING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-F 369', 'INSURANCE, RISK MANAGEMENT, AND RETIREMENT PLANNING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-F 390', 'FINANCE TOPICS ABROAD', '1-5', ARRAY[]::TEXT[]),
    ('BUS-F 402', 'CORPORATE FINANCIAL STRATEGY AND GOVERNANCE', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-F 419', 'BEHAVIORAL FINANCE', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-F 420', 'EQUITY AND FIXED INCOME INVESTMENT', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-F 421', 'DERIVATIVES SECURITIES/CORPORATE RISK MANAGEMENT', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-F 434', 'QUANTITATIVE FINANCE', '3', ARRAY['Spring 2026']),
    ('BUS-F 446', 'BANK AND FINANCIAL INTERMEDIATION', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-F 470', 'FINANCE TOPICS ABROAD', '1-5', ARRAY[]::TEXT[]),
    ('BUS-F 494', 'INTERNATIONAL FINANCE', '3', ARRAY['Spring 2026']),
    ('BUS-T 376', 'COMPASS 3 HONORS', '1', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-A 327', 'TAX ANALYSIS AND APPLICATIONS', '1.5', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-S 302', 'DIGITAL BUSINESS TECHNOLOGIES', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-S 305', 'TECHNOLOGY INFRASTRUCTURE', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-S 307', 'DATA DESIGN & MANAGEMENT', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-S 310', 'ANALYSIS AND DESIGN OF DIGITAL SOLUTIONS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-S 364', 'BUSINESS DATA PROGRAMMING', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-K 353', 'BUSINESS ANALYTICS & MODELING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-K 360', 'VISUAL BASIC FOR APPLICATIONS (VBA) AND APPLICATION INTEGRATION', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-P 429', 'OPERATIONS PROCESSES', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-P 481', 'SUPPLY CHAIN PLANNING AND ANALYTICS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-S 326', 'WEB AND SOCIAL MEDIA ANALYTICS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-S 400', 'INTEGRATION OF SYSTEMS AND THE BUSINESS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-S 428', 'ADV APPLICATION DEVELOPMENT', '3', ARRAY['Spring 2026']),
    ('BUS-S 433', 'INFORMATION SYSTEMS SECURITY', '3', ARRAY['Spring 2026']),
    ('BUS-S 455', 'INTRODUCTION TO INFORMATION SYSTEMS RESEARCH (TOPICS IN INFORMATION SYSTEMS)', '1-5', ARRAY['Spring 2026']),
    ('BUS-J 285', 'COMPETITIVE STRATEGY & INDUSTRY', '3', ARRAY['Fall 2025']),
    ('BUS-D 311', 'GLOBAL MANAGEMENT', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-D 312', 'BUILDING MANAGERIAL CROSS CULTURAL COMPETENCIES', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-L 406', 'LAW & ETHICS AT WORK', '3', ARRAY[]::TEXT[]),
    ('BUS-W 430', 'ORGANIZATIONS AND ORGANIZATIONAL DESIGN', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 303', 'MARKETING RESEARCH', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 405', 'CONSUMER BEHAVIOR', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 346', 'ANALYSIS OF MARKETING DATA', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 295', 'MARKETING IN OUR WORLD TODAY', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 310', 'BRAND MANAGEMENT PRACTICUM', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 330', 'CONSULTATIVE SELLING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 339', 'RETAIL MARKETING ANALYTICS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 344', 'CREATIVITY AND COMMUNICATION', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 390', 'MARKETING TOPICS ABROAD', '1-5', ARRAY[]::TEXT[]),
    ('BUS-M 401', 'INTERNATIONAL MARKETING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 407', 'BUSINESS-TO-BUSINESS MARKETING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 415', 'ADVERTISING AND INTEGRATED MARKETING COMMUNICATIONS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 419', 'RETAIL STRATEGY', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 426', 'SALES MANAGEMENT', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 429', 'LEGAL ASPECTS OF MARKETING', '3', ARRAY[]::TEXT[]),
    ('BUS-M 431', 'BRAND MANAGEMENT', '3', ARRAY['Spring 2026']),
    ('BUS-M 432', 'DIGITAL MARKETING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 455', 'PRICING (TOPICS IN MARKETING)', '1-5', ARRAY['Spring 2026']),
    ('BUS-M 470', 'CONTENT MARKETING PRACTICUM', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-M 450', 'MARKETING STRATEGY', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-M 436', 'ADVANCED PROFESSIONAL SALES PRACTICUM', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-P 319', 'SUPPLY CHAIN MANAGEMENT WITH DIGITAL TECHNOLOGIES', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-P 320', 'SUPPLY CHAIN MANAGEMENT: GLOBAL SOURCING', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-K 327', 'MODELING BUSINESS DATA', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-P 316', 'SUSTAINABLE OPERATIONS', '3', ARRAY['Spring 2026']),
    ('BUS-P 356', 'LEAN SIX SIGMA', '3', ARRAY['Spring 2026']),
    ('BUS-P 431', 'SUPPLY CHAIN MANAGEMENT: LOGISTICS AND DISTRIBUTION', '3', ARRAY['Spring 2026']),
    ('BUS-P 454', 'SUPPLY CHAIN CONSULTING PRACTICUM', '3', ARRAY['Fall 2025']),
    ('ECON-E 201', 'INTRODUCTION TO MICROECONOMICS', '3', ARRAY['Fall 2025', 'Spring 2026', 'Summer 2026']),
    ('BUS-G 406', 'BUS ENTERPRISE & PUBLIC POLICY', '3', ARRAY['Spring 2026']),
    ('BUS-G 494', 'PUBLIC POLICY AND THE INTERNATIONAL ECONOMY', '3', ARRAY['Spring 2026']),
    ('BUS-R 305', 'INTRODUCTION TO REAL ESTATE ANALYSIS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-R 440', 'REAL ESTATE APPRAISALS', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-L 408', 'REAL ESTATE LAW', '3', ARRAY['Fall 2025', 'Spring 2026']),
    ('BUS-R 443', 'REAL ESTATE FINANCE AND INVESTMENT ANALYSIS', '3', ARRAY['Fall 2025', 'Spring 2026'])
ON CONFLICT (course_code) DO UPDATE SET
    course_name = EXCLUDED.course_name,
    credits = EXCLUDED.credits,
    scheduled_terms = EXCLUDED.scheduled_terms;

-- ============================================
-- 3. INSERT DEGREE REQUIREMENTS
-- ============================================

-- Accounting BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 1, fall - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 1, fall - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Math for Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 1, fall - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 1, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 1, fall - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 1, spring - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 1, spring - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 1, spring - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 1, spring - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 1, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Supplemental Credits for Graduation',
    1,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, fall - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, fall - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, fall - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, fall - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, spring - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, spring - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, spring - Intermediate Financial Reporting and Analysis I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Intermediate Financial Reporting and Analysis I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 2, spring - IUB GenEd Natural Science*
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd Natural Science*',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later. Asterisk indicates specific condition or choice.',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 3, fall - Communicating Accounting Analytics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Communicating Accounting Analytics',
    1.5,
    FALSE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    1.5,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 3, spring - Intermediate Financial Reporting and Analysis II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Intermediate Financial Reporting and Analysis II',
    3,
    TRUE,
    'C',
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 3, spring - Taxes and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Taxes and Decision Making',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 3, spring - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 3, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 4, fall - Cost and Performance Measurement for Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Cost and Performance Measurement for Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 4, fall - Foundations of Auditing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Foundations of Auditing',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 4, fall - Fundamentals of Econ for Bus II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Fundamentals of Econ for Bus II',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 4, spring - Accounting Major Elective 300/400-level
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Accounting Major Elective 300/400-level',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 4, spring - Accounting Major Elective 400-level
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Accounting Major Elective 400-level',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 4, spring - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 4, spring - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Accounting BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Accounting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, fall - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, fall - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, fall - IUB GenEd Natural Science*
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Natural Science*',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later. Asterisk indicates specific condition or choice.',
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, spring - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, spring - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Math for Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, spring - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, spring - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Supplemental Credits for Graduation',
    1,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 1, Spring',
    NULL
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, fall - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, fall - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, fall - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Supplemental Credits for Graduation',
    2,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, spring - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, spring - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, spring - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, spring - Business Econometrics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Business Econometrics',
    3,
    TRUE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, spring - Managerial Economics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Managerial Economics',
    3,
    TRUE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, spring - Fundamentals of Econ for Bus II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Fundamentals of Econ for Bus II',
    3,
    TRUE,
    'C',
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, fall - Game Theory for Business Strategy
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Game Theory for Business Strategy',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, fall - Strategy Beyond Markets
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Strategy Beyond Markets',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, fall - Money, Banking, and Capital Markets
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Money, Banking, and Capital Markets',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, fall - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, fall - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 4, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    1,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, spring - Capstone in Economic Consulting
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Capstone in Economic Consulting',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, spring - Predictive Analytics for Business Strategy
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Predictive Analytics for Business Strategy',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, spring - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Econ Consulting BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, fall - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, fall - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Math for Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, fall - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, fall - IUB GenEd Natural Science*
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Natural Science*',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later. Asterisk indicates specific condition or choice.',
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, spring - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, spring - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, spring - Explore Entrepreneurship
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Explore Entrepreneurship',
    3,
    TRUE,
    NULL,
    NULL,
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Supplemental Credits for Graduation',
    1,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, fall - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, fall - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, fall - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, fall - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, spring - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, spring - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, spring - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, spring - Idea Validation & Business Model Development
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Idea Validation & Business Model Development',
    3,
    TRUE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, spring - Venture Capital and Entrepreneurial Finance
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Venture Capital and Entrepreneurial Finance',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, spring - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Supplemental Credits for Graduation',
    2,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, fall - New Venture Planning
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'New Venture Planning',
    3,
    TRUE,
    NULL,
    NULL,
    'Year 4, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, fall - Fundamentals of Econ for Bus II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Fundamentals of Econ for Bus II',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, fall - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, fall - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 4, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    2,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, spring - Corporate Venturing or Practicum in Entrepreneurship
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Corporate Venturing or Practicum in Entrepreneurship',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, spring - Entrepreneurship and Corporate Innovation Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Entrepreneurship and Corporate Innovation Elective',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    2,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, fall - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, fall - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Math for Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, fall - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, fall - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, spring - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '15.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, spring - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '15.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '15.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, spring - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '15.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '15.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 1, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Supplemental Credits for Graduation',
    2,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 1, Spring',
    '15.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, fall - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, fall - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, fall - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, fall - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Supplemental Credits for Graduation',
    2,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 2, Fall',
    '14'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, spring - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, spring - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, spring - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, spring - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 2, spring - IUB GenEd Natural Science*
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd Natural Science*',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later. Asterisk indicates specific condition or choice.',
    'Year 2, Spring',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 3, spring - Intermediate Investments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Intermediate Investments',
    3,
    TRUE,
    'C-',
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 3, spring - Intermediate Corporate Finance
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Intermediate Corporate Finance',
    3,
    TRUE,
    'C-',
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 3, spring - Intermediate Financial Reporting and Analysis: A User's Perspective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Intermediate Financial Reporting and Analysis: A User''s Perspective',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 3, spring - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 4, fall - Management Accounting for Finance Professionals
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Management Accounting for Finance Professionals',
    1.5,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 4, fall - Finance Elective 300/400-level
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Finance Elective 300/400-level',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 4, fall - Finance Elective 300/400-level
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Finance Elective 300/400-level',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 4, fall - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 4, fall - Fundamentals of Econ for BUS II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Fundamentals of Econ for BUS II',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 4, fall - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 4, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 4, spring - Accounting Elective Course
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Accounting Elective Course',
    3,
    FALSE,
    NULL,
    'Choose one course from the list (1.5-3 credits)',
    'Year 4, Spring',
    15
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 4, spring - Finance Elective 400-level
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Finance Elective 400-level',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Spring',
    15
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 4, spring - Finance Elective 400-level
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Finance Elective 400-level',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Spring',
    15
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 4, spring - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    15
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Finance BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Spring',
    15
FROM degrees d
WHERE d.major_name = 'Finance BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, fall - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Supplemental Credits for Graduation',
    1,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 1, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, spring - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, spring - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Math for Business',
    3,
    TRUE,
    'C',
    'MATH-M 211 and MATH-S 211 are 4 credits, but only 3 credits count toward the requirement',
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, spring - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 1, spring - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, fall - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, fall - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, fall - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, fall - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, spring - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, spring - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    'Choose one option from Global Business Analysis or Global Business Immersion',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 2, spring - IUB GenEd Natural Science
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd Natural Science',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 3, spring - Digital Business Technologies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Digital Business Technologies',
    3,
    TRUE,
    'C',
    NULL,
    'Year 3, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 3, spring - Technology Infrastructure
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Technology Infrastructure',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 3, spring - Data Design & Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Data Design & Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 3, spring - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 3, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 3, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 4, fall - Analysis and Design of Digital Solutions
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Analysis and Design of Digital Solutions',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 4, fall - Business Data Programming
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Business Data Programming',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 4, fall - Information Systems Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Information Systems Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 4, fall - Fundamentals of Econ for Bus II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Fundamentals of Econ for Bus II',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 4, spring - Information Systems Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Information Systems Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Spring',
    '12'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 4, spring - Information Systems Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Information Systems Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Spring',
    '12'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 4, spring - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '12'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Information Systems BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Spring',
    '12'
FROM degrees d
WHERE d.major_name = 'Information Systems BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, fall - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, fall - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Math for Business',
    3,
    TRUE,
    'C',
    'MATH-M 211 and MATH-S 211 are 4 credits, but only 3 credits count toward the requirement',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, fall - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, spring - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, spring - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 1, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Supplemental Credits for Graduation',
    1,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, fall - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, fall - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, fall - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, fall - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, spring - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, spring - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    'Choose one option from Global Business Analysis or Global Business Immersion',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 2, spring - IUB GenEd Natural Science
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd Natural Science',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 3, spring - Introduction to Human Resources
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Human Resources',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 3, spring - Competitive Strategy and Industry
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Competitive Strategy and Industry',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 3, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 3, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 4, fall - Leadership, Teamwork, and Diversity
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Leadership, Teamwork, and Diversity',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '13'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 4, fall - Management Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Management Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Fall',
    '13'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 4, fall - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '13'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 4, fall - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '13'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Fall',
    '13'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 4, spring - International Competitive Strategy
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'International Competitive Strategy',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 4, spring - Management Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Management Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 4, spring - Fundamentals of Econ for Bus II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Fundamentals of Econ for Bus II',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Management BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, fall - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, fall - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, spring - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, spring - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Math for Business',
    3,
    TRUE,
    'C',
    'MATH-M 211 and MATH-S 211 are 4 credits, but only 3 credits count toward the requirement',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, spring - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 1, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Supplemental Credits for Graduation',
    1,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, fall - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, fall - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, fall - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, spring - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, spring - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    'Choose one option from Global Business Analysis or Global Business Immersion',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 2, spring - IUB GenEd Natural Science
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd Natural Science',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 3, spring - Marketing Research
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Marketing Research',
    3,
    TRUE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 3, spring - Consumer Behavior
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Consumer Behavior',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 3, spring - Analysis of Marketing Data
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Analysis of Marketing Data',
    3,
    TRUE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 3, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 4, fall - Marketing Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Marketing Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 4, fall - Marketing Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Marketing Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 4, fall - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 4, spring - Marketing Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Marketing Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 4, spring - Marketing Strategy
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Marketing Strategy',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 4, spring - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 4, spring - Fundamentals of Econ for Bus II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Fundamentals of Econ for Bus II',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Marketing BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, fall - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, fall - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, spring - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, spring - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Math for Business',
    3,
    TRUE,
    'C',
    'MATH-M 211 and MATH-S 211 are 4 credits, but only 3 credits count toward the requirement',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, spring - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Supplemental Credits for Graduation',
    1,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, fall - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, fall - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, fall - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, fall - IUB GenEd Natural Science
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'IUB GenEd Natural Science',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, spring - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, spring - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    'Choose one option from Global Business Analysis or Global Business Immersion',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, spring - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, spring - Marketing Research
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Marketing Research',
    3,
    TRUE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, spring - Consultative Selling
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Consultative Selling',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, spring - Analysis of Marketing Data
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Analysis of Marketing Data',
    3,
    TRUE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, spring - Professional Sales Elective (Group A)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Professional Sales Elective (Group A)',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, fall - Consumer Behavior
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Consumer Behavior',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, fall - Sales Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Sales Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, fall - Marketing Elective (Group B)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Marketing Elective (Group B)',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, fall - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, spring - Marketing Elective (Group B)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Marketing Elective (Group B)',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, spring - Marketing Strategy
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Marketing Strategy',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, spring - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, spring - Fundamentals of Econ for Bus II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Fundamentals of Econ for Bus II',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Marketing and Professional Sales BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, fall - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, fall - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Math for Business',
    3,
    TRUE,
    'C',
    'MATH-M 211 and MATH-S 211 are 4 credits, but only 3 credits count toward the requirement',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, fall - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, fall - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, spring - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, spring - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 1, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Supplemental Credits for Graduation',
    2,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, fall - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, fall - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, fall - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, fall - IUB GenEd Natural Science
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'IUB GenEd Natural Science',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, spring - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, spring - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    'Choose one option from Global Business Analysis or Global Business Immersion',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 2, spring - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 3, spring - Supply Chain Management with Digital Technologies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Supply Chain Management with Digital Technologies',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 3, spring - Supply Chain Management: Global Sourcing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Supply Chain Management: Global Sourcing',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 3, spring - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 3, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 3, Spring',
    '13'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 4, fall - Operations Processes
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Operations Processes',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 4, fall - Operations Management Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Operations Management Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 4, fall - Fundamentals of Econ for Bus II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Fundamentals of Econ for Bus II',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 4, fall - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 4, spring - Operations Management Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Operations Management Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 4, spring - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Operations Management BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    2,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Operations Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, fall - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, fall - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, fall - IUB GenEd Natural Science*
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Natural Science*',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later. Asterisk indicates specific condition or choice.',
    'Year 1, Spring',
    '16'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, spring - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, spring - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Math for Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, spring - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, spring - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, spring - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Supplemental Credits for Graduation',
    1,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 1, Spring',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, fall - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, fall - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, fall - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, fall - Supplemental Credit for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Supplemental Credit for Graduation',
    1,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 2, Fall',
    '14.5'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, spring - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, spring - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, spring - Game Theory for Business Strategy
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Game Theory for Business Strategy',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, spring - Managerial Economics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Managerial Economics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, spring - Fundamentals of Econ for Bus II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Fundamentals of Econ for Bus II',
    3,
    TRUE,
    'C',
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, fall - Business Econometrics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Business Econometrics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, fall - Money, Banking, and Capital Markets
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Money, Banking, and Capital Markets',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, fall - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, spring - Business Enterprise and Public Policy
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Business Enterprise and Public Policy',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, spring - Public Policy and the International Economy
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Public Policy and the International Economy',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, spring - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    2,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, fall - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, fall - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Math for Business',
    3,
    TRUE,
    'C',
    'MATH-M 211 and MATH-S 211 are 4 credits, but only 3 credits count toward the requirement',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, fall - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, spring - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, spring - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 1, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Supplemental Credits for Graduation',
    1,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 1, Spring',
    '14'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, fall - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, fall - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, fall - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, fall - IUB GenEd Natural Science
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'IUB GenEd Natural Science',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, spring - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, spring - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    'Choose one option from Global Business Analysis or Global Business Immersion',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 2, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    NULL,
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Additional credits needed for graduation can be used to explore interests, including a minor or co-major/second major',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 3, spring - Intermediate Investments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Intermediate Investments',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 3, spring - Intermediate Corporate Finance
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Intermediate Corporate Finance',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 3, spring - Introduction to Real Estate Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Real Estate Analysis',
    3,
    TRUE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 3, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 4, fall - Intermediate Financial Reporting and Analysis: A User's Perspective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Intermediate Financial Reporting and Analysis: A User''s Perspective',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '13'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 4, fall - Real Estate Appraisals
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Real Estate Appraisals',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '13'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 4, fall - Real Estate Law
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Real Estate Law',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '13'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 4, fall - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '13'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Fall',
    '13'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 4, spring - Real Estate Finance and Investment Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Real Estate Finance and Investment Analysis',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 4, spring - Real Estate Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Real Estate Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 4, spring - Fundamentals of Econ for Bus II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Fundamentals of Econ for Bus II',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 4, spring - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Real Estate BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Real Estate BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, fall - English Composition
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'English Composition',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, fall - Compass 1
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Compass 1',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Foundations of Business Information Systems and Decision Making',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'Fundamentals of Econ for Bus I',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, fall - IUB GenEd Social & Historical Studies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'fall',
    'IUB GenEd Social & Historical Studies',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, spring - Business Presentations
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Business Presentations',
    3,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, spring - Math for Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Math for Business',
    3,
    TRUE,
    'C',
    'MATH-M 211 and MATH-S 211 are 4 credits, but only 3 credits count toward the requirement',
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Introductory Accounting Principles and Analysis',
    1,
    TRUE,
    'C',
    NULL,
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 1, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    1,
    'spring',
    'Supplemental Credits for Graduation',
    2,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 1, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, fall - Business Writing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business Writing',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Management Accounting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, fall - Statistics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Statistics',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, fall - Global Business Environments
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Global Business Environments',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, fall - Business, Government, & Society
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'Business, Government, & Society',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, fall - IUB GenEd Arts & Humanities
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'fall',
    'IUB GenEd Arts & Humanities',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Fall',
    '16.5'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, spring - Compass 2
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Compass 2',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Technology and Business Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, spring - Legal Environment of Business
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Legal Environment of Business',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Financial Reporting and Analysis',
    3,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'Global Business Analysis or Global Business Immersion',
    1.5,
    TRUE,
    'C',
    NULL,
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 2, spring - IUB GenEd Natural & Mathematical Sciences
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    2,
    'spring',
    'IUB GenEd Natural & Mathematical Sciences',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 2, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Integrated Core (I-Core)',
    12,
    TRUE,
    NULL,
    'I-Core includes Finance, Marketing, Operations, and Leadership components',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 3, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 3, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 3, spring - Supply Chain Management with Digital Technologies
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Supply Chain Management with Digital Technologies',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 3, spring - Supply Chain Management: Global Sourcing
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Supply Chain Management: Global Sourcing',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 3, spring - Supply Chain Management Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Supply Chain Management Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'Introduction to Business Ethics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 3, spring - IUB GenEd World Languages or World Cultures
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    3,
    'spring',
    'IUB GenEd World Languages or World Cultures',
    3,
    FALSE,
    NULL,
    'Many courses available - to be populated later',
    'Year 3, Spring',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 4, fall - Operations Processes
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Operations Processes',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 4, fall - Supply Chain Planning & Analytics
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supply Chain Planning & Analytics',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 4, fall - Strategic Management
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Strategic Management',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 4, fall - Compass 3
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Compass 3',
    1,
    FALSE,
    NULL,
    NULL,
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 4, fall - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'fall',
    'Supplemental Credits for Graduation',
    2,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Fall',
    '15'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 4, spring - Supply Chain Management: Logistics and Distribution
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supply Chain Management: Logistics and Distribution',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '12'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 4, spring - Supply Chain Management Elective
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supply Chain Management Elective',
    3,
    FALSE,
    NULL,
    'Choose one 3-credit course from the list',
    'Year 4, Spring',
    '12'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 4, spring - Fundamentals of Econ for Bus II
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Fundamentals of Econ for Bus II',
    3,
    FALSE,
    NULL,
    NULL,
    'Year 4, Spring',
    '12'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- Supply Chain Management BSB - Year 4, spring - Supplemental Credits for Graduation
INSERT INTO degree_requirements (
    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits
)
SELECT 
    d.id,
    4,
    'spring',
    'Supplemental Credits for Graduation',
    3,
    FALSE,
    NULL,
    'Placeholder for general credit requirements',
    'Year 4, Spring',
    '12'
FROM degrees d
WHERE d.major_name = 'Supply Chain Management BSB' AND d.school = 'Kelley School of Business'
ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;

-- ============================================
-- 4. INSERT REQUIREMENT FULFILLMENTS
-- ============================================

-- Accounting BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 1, fall - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 1, fall - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 1, fall - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 1, spring - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 1, spring - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 1, spring - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 2, fall - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 2, fall - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 2, fall - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 2, spring - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 2, spring - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 2, spring - Intermediate Financial Reporting and Analysis I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 311']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Intermediate Financial Reporting and Analysis I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 3, fall - Communicating Accounting Analytics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 314']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Communicating Accounting Analytics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 3, spring - Intermediate Financial Reporting and Analysis II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 312']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Intermediate Financial Reporting and Analysis II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 3, spring - Taxes and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 329']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Taxes and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 4, fall - Cost and Performance Measurement for Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 325']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Cost and Performance Measurement for Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 4, fall - Foundations of Auditing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 424']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Foundations of Auditing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 4, fall - Fundamentals of Econ for Bus II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 4, spring - Accounting Major Elective 300/400-level
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 337', 'BUS-A 345', 'BUS-A 420', 'BUS-A 422', 'BUS-A 437', 'BUS-A 440']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Accounting Major Elective 300/400-level'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 4, spring - Accounting Major Elective 400-level
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 420', 'BUS-A 422', 'BUS-A 437', 'BUS-A 440']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Accounting Major Elective 400-level'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 4, spring - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Accounting BSB - Year 4, spring - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'Accounting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, fall - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, fall - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, spring - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, spring - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 1, spring - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, fall - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, fall - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, fall - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, spring - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, spring - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, spring - Business Econometrics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 350']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Business Econometrics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, spring - Managerial Economics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 304']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Managerial Economics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 3, spring - Fundamentals of Econ for Bus II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, fall - Game Theory for Business Strategy
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 303']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Game Theory for Business Strategy'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, fall - Strategy Beyond Markets
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 456']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Strategy Beyond Markets'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, fall - Money, Banking, and Capital Markets
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 345']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Money, Banking, and Capital Markets'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, fall - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, spring - Capstone in Economic Consulting
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 400']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Capstone in Economic Consulting'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, spring - Predictive Analytics for Business Strategy
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 492']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Predictive Analytics for Business Strategy'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Econ Consulting BSB - Year 4, spring - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'BEPP: Econ Consulting BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, fall - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, fall - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, fall - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, spring - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, spring - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 1, spring - Explore Entrepreneurship
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-W 212']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Explore Entrepreneurship'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, fall - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, fall - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, fall - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, spring - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, spring - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, spring - Idea Validation & Business Model Development
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-W 235']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Idea Validation & Business Model Development'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, spring - Venture Capital and Entrepreneurial Finance
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-F 317']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Venture Capital and Entrepreneurial Finance'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, spring - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, fall - New Venture Planning
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-W 313']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'New Venture Planning'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, fall - Fundamentals of Econ for Bus II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, fall - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, spring - Corporate Venturing or Practicum in Entrepreneurship
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-W 409', 'BUS-W 420']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Corporate Venturing or Practicum in Entrepreneurship'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Entreprenrshp & Corp Innov BSB - Year 4, spring - Entrepreneurship and Corporate Innovation Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 411', 'BUS-J 355', 'BUS-L 311', 'BUS-M 422', 'BUS-W 326', 'BUS-W 355', 'BUS-W 406', 'BUS-W 409', 'BUS-W 420', 'BUS-Z 340', 'BUS-Z 404', 'BUS-Z 447']) AS c(code)
WHERE d.major_name = 'Entreprenrshp & Corp Innov BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Entrepreneurship and Corporate Innovation Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 1, fall - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 1, fall - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 1, fall - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 1, spring - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 1, spring - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 2, fall - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 2, fall - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 2, fall - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 2, fall - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 2, spring - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 2, spring - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 2, spring - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 2, spring - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 3, spring - Intermediate Investments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-F 303']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Intermediate Investments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 3, spring - Intermediate Corporate Finance
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-F 305']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Intermediate Corporate Finance'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 3, spring - Intermediate Financial Reporting and Analysis: A User's Perspective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 310']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Intermediate Financial Reporting and Analysis: A User''s Perspective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 4, fall - Management Accounting for Finance Professionals
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 324']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting for Finance Professionals'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 4, fall - Finance Elective 300/400-level
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-F 307', 'BUS-F 317', 'BUS-F 325', 'BUS-F 335', 'BUS-F 355', 'BUS-F 355', 'BUS-F 365', 'BUS-F 369', 'BUS-F 390', 'BUS-F 402', 'BUS-F 419', 'BUS-F 420', 'BUS-F 421', 'BUS-F 434', 'BUS-F 446', 'BUS-F 470', 'BUS-F 494', 'BUS-G 345', 'BUS-F 307', 'BUS-F 317', 'BUS-F 325', 'BUS-F 335', 'BUS-F 355', 'BUS-F 355', 'BUS-F 365', 'BUS-F 369', 'BUS-F 390', 'BUS-F 402', 'BUS-F 419', 'BUS-F 420', 'BUS-F 421', 'BUS-F 434', 'BUS-F 446', 'BUS-F 470', 'BUS-F 494', 'BUS-G 345']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Finance Elective 300/400-level'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 4, fall - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375', 'BUS-T 376']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 4, fall - Fundamentals of Econ for BUS II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Fundamentals of Econ for BUS II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 4, spring - Accounting Elective Course
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 327', 'BUS-A 329', 'BUS-A 420', 'BUS-A 422']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Accounting Elective Course'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 4, spring - Finance Elective 400-level
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-F 402', 'BUS-F 419', 'BUS-F 420', 'BUS-F 421', 'BUS-F 434', 'BUS-F 446', 'BUS-F 470', 'BUS-F 494', 'BUS-F 402', 'BUS-F 419', 'BUS-F 420', 'BUS-F 421', 'BUS-F 434', 'BUS-F 446', 'BUS-F 470', 'BUS-F 494']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Finance Elective 400-level'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Finance BSB - Year 4, spring - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'Finance BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 1, fall - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 1, spring - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 1, spring - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 2, fall - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 2, fall - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 2, fall - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 2, spring - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 2, spring - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 3, spring - Digital Business Technologies
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-S 302']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Digital Business Technologies'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 3, spring - Technology Infrastructure
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-S 305']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology Infrastructure'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 3, spring - Data Design & Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-S 307']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Data Design & Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 3, spring - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 4, fall - Analysis and Design of Digital Solutions
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-S 310']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Analysis and Design of Digital Solutions'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 4, fall - Business Data Programming
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-S 364']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Data Programming'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 4, fall - Information Systems Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 353', 'BUS-K 360', 'BUS-P 429', 'BUS-P 481', 'BUS-S 326', 'BUS-S 400', 'BUS-S 428', 'BUS-S 433', 'BUS-S 455']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Information Systems Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 4, fall - Fundamentals of Econ for Bus II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 4, spring - Information Systems Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 353', 'BUS-K 360', 'BUS-P 429', 'BUS-P 481', 'BUS-S 326', 'BUS-S 400', 'BUS-S 428', 'BUS-S 433', 'BUS-S 455', 'BUS-K 353', 'BUS-K 360', 'BUS-P 429', 'BUS-P 481', 'BUS-S 326', 'BUS-S 400', 'BUS-S 428', 'BUS-S 433', 'BUS-S 455']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Information Systems Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Information Systems BSB - Year 4, spring - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'Information Systems BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 1, fall - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 1, fall - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 1, spring - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 2, fall - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 2, fall - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 2, fall - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 2, spring - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 2, spring - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 3, spring - Introduction to Human Resources
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-Z 340']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Human Resources'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 3, spring - Competitive Strategy and Industry
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 285']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Competitive Strategy and Industry'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 4, fall - Leadership, Teamwork, and Diversity
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-Z 447']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Leadership, Teamwork, and Diversity'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 4, fall - Management Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 311', 'BUS-D 312', 'BUS-J 355', 'BUS-L 406', 'BUS-W 212', 'BUS-W 235', 'BUS-W 326', 'BUS-W 355', 'BUS-W 430', 'BUS-Z 404']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 4, fall - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 4, fall - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 4, spring - International Competitive Strategy
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 411']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'International Competitive Strategy'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 4, spring - Management Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 311', 'BUS-D 312', 'BUS-J 355', 'BUS-L 406', 'BUS-W 212', 'BUS-W 235', 'BUS-W 326', 'BUS-W 355', 'BUS-W 430', 'BUS-Z 404']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Management Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Management BSB - Year 4, spring - Fundamentals of Econ for Bus II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 1, fall - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 1, spring - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 1, spring - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 2, fall - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 2, fall - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 2, fall - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 2, spring - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 2, spring - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 3, spring - Marketing Research
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 303']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Marketing Research'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 3, spring - Consumer Behavior
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 405']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Consumer Behavior'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 3, spring - Analysis of Marketing Data
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 346']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Analysis of Marketing Data'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 4, fall - Marketing Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 295', 'BUS-M 310', 'BUS-M 330', 'BUS-M 339', 'BUS-M 344', 'BUS-M 390', 'BUS-M 401', 'BUS-M 407', 'BUS-M 415', 'BUS-M 419', 'BUS-M 422', 'BUS-M 426', 'BUS-M 429', 'BUS-M 431', 'BUS-M 432', 'BUS-M 455', 'BUS-M 455', 'BUS-M 455', 'BUS-M 455', 'BUS-M 470', 'BUS-M 295', 'BUS-M 310', 'BUS-M 330', 'BUS-M 339', 'BUS-M 344', 'BUS-M 390', 'BUS-M 401', 'BUS-M 407', 'BUS-M 415', 'BUS-M 419', 'BUS-M 422', 'BUS-M 426', 'BUS-M 429', 'BUS-M 431', 'BUS-M 432', 'BUS-M 455', 'BUS-M 455', 'BUS-M 455', 'BUS-M 455', 'BUS-M 470']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Marketing Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 4, fall - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 4, spring - Marketing Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 295', 'BUS-M 310', 'BUS-M 330', 'BUS-M 339', 'BUS-M 344', 'BUS-M 390', 'BUS-M 401', 'BUS-M 407', 'BUS-M 415', 'BUS-M 419', 'BUS-M 422', 'BUS-M 426', 'BUS-M 429', 'BUS-M 431', 'BUS-M 432', 'BUS-M 455', 'BUS-M 455', 'BUS-M 455', 'BUS-M 455', 'BUS-M 470']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Marketing Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 4, spring - Marketing Strategy
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 450']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Marketing Strategy'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 4, spring - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing BSB - Year 4, spring - Fundamentals of Econ for Bus II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'Marketing BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, fall - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, spring - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, spring - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, fall - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, fall - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, fall - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, spring - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, spring - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, spring - Marketing Research
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 303']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Marketing Research'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, spring - Consultative Selling
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 330']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Consultative Selling'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, spring - Analysis of Marketing Data
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 346']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Analysis of Marketing Data'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, spring - Professional Sales Elective (Group A)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 407', 'BUS-M 436', 'BUS-M 455', 'BUS-Z 404']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Professional Sales Elective (Group A)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, fall - Consumer Behavior
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 405']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Consumer Behavior'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, fall - Sales Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 426']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Sales Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, fall - Marketing Elective (Group B)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 295', 'BUS-M 310', 'BUS-M 339', 'BUS-M 344', 'BUS-M 390', 'BUS-M 401', 'BUS-M 415', 'BUS-M 419', 'BUS-M 422', 'BUS-M 429', 'BUS-M 431', 'BUS-M 432', 'BUS-M 455', 'BUS-M 455', 'BUS-M 455', 'BUS-M 455', 'BUS-M 470']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Marketing Elective (Group B)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, fall - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, spring - Marketing Elective (Group B)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 295', 'BUS-M 310', 'BUS-M 339', 'BUS-M 344', 'BUS-M 390', 'BUS-M 401', 'BUS-M 415', 'BUS-M 419', 'BUS-M 422', 'BUS-M 429', 'BUS-M 431', 'BUS-M 432', 'BUS-M 455', 'BUS-M 455', 'BUS-M 455', 'BUS-M 455', 'BUS-M 470']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Marketing Elective (Group B)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, spring - Marketing Strategy
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-M 450']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Marketing Strategy'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, spring - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Marketing and Professional Sales BSB - Year 4, spring - Fundamentals of Econ for Bus II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'Marketing and Professional Sales BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 1, fall - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 1, fall - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 1, spring - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 2, fall - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 2, fall - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 2, fall - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 2, spring - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 2, spring - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 3, spring - Supply Chain Management with Digital Technologies
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-P 319']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Supply Chain Management with Digital Technologies'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 3, spring - Supply Chain Management: Global Sourcing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-P 320']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Supply Chain Management: Global Sourcing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 3, spring - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 4, fall - Operations Processes
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-P 429']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Operations Processes'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 4, fall - Operations Management Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 327', 'BUS-K 353', 'BUS-P 316', 'BUS-P 356', 'BUS-P 431', 'BUS-P 454', 'BUS-P 481', 'BUS-S 305', 'BUS-S 307', 'BUS-S 326', 'BUS-S 364', 'BUS-S 400', 'BUS-Z 404']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Operations Management Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 4, fall - Fundamentals of Econ for Bus II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 4, spring - Operations Management Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 327', 'BUS-K 353', 'BUS-P 316', 'BUS-P 356', 'BUS-P 431', 'BUS-P 454', 'BUS-P 481', 'BUS-S 305', 'BUS-S 307', 'BUS-S 326', 'BUS-S 364', 'BUS-S 400', 'BUS-Z 404']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Operations Management Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Operations Management BSB - Year 4, spring - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'Operations Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, fall - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, fall - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-E 201', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, spring - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, spring - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 1, spring - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, fall - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, fall - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, fall - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, spring - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, spring - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, spring - Game Theory for Business Strategy
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 303']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Game Theory for Business Strategy'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, spring - Managerial Economics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 304']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Managerial Economics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, spring - Fundamentals of Econ for Bus II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, fall - Business Econometrics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 350']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Econometrics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, fall - Money, Banking, and Capital Markets
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 345']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Money, Banking, and Capital Markets'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, fall - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, spring - Business Enterprise and Public Policy
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 406']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Business Enterprise and Public Policy'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, spring - Public Policy and the International Economy
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 494']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Public Policy and the International Economy'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- BEPP: Public Pol Anlys BSB - Year 4, spring - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375']) AS c(code)
WHERE d.major_name = 'BEPP: Public Pol Anlys BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 1, fall - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 1, fall - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 1, spring - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 1, spring - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 2, fall - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 2, fall - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 2, fall - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 2, spring - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 2, spring - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 3, spring - Intermediate Investments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-F 303']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Intermediate Investments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 3, spring - Intermediate Corporate Finance
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-F 305']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Intermediate Corporate Finance'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 3, spring - Introduction to Real Estate Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-R 305']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Real Estate Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 4, fall - Intermediate Financial Reporting and Analysis: A User's Perspective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 310']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Intermediate Financial Reporting and Analysis: A User''s Perspective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 4, fall - Real Estate Appraisals
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-R 440']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Real Estate Appraisals'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 4, fall - Real Estate Law
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 408']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Real Estate Law'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 4, fall - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 4, spring - Real Estate Finance and Investment Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-R 443']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Real Estate Finance and Investment Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 4, spring - Real Estate Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 329', 'BUS-F 307', 'BUS-F 317', 'BUS-F 325', 'BUS-F 335', 'BUS-F 355', 'BUS-F 365', 'BUS-F 369', 'BUS-F 390', 'BUS-F 402', 'BUS-F 419', 'BUS-F 420', 'BUS-F 421', 'BUS-F 434', 'BUS-F 446', 'BUS-F 494', 'BUS-G 345']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Real Estate Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 4, spring - Fundamentals of Econ for Bus II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Real Estate BSB - Year 4, spring - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'Real Estate BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 1, fall - English Composition
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['CMLT-C 110', 'ENG-W 131', 'ENG-W 170', 'ENG-W 171']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'English Composition'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 1, fall - Compass 1
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 175', 'BUS-T 176']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 1'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 1, fall - Foundations of Business Information Systems and Decision Making
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 201', 'BUS-K 204']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Foundations of Business Information Systems and Decision Making'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 1, fall - Fundamentals of Econ for Bus I
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 251', 'ECON-S 251']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus I'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 1, spring - Business Presentations
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 104', 'BUS-C 106']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Business Presentations'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 1, spring - Math for Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['MATH-B 110', 'MATH-M 119', 'MATH-M 211', 'MATH-S 211']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Math for Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 1, spring - Introductory Accounting Principles and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 100']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 1
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introductory Accounting Principles and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 2, fall - Business Writing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-C 204', 'BUS-C 205']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business Writing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 2, fall - Management Accounting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 306', 'BUS-A 309']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Management Accounting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 2, fall - Statistics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-E 370', 'ECON-S 370', 'MATH-M 365', 'STAT-S 301', 'STAT-S 350']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Statistics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 2, fall - Global Business Environments
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 270']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Global Business Environments'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 2, fall - Business, Government, & Society
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-G 202']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Business, Government, & Society'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 2, spring - Compass 2
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 275', 'BUS-T 276']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Compass 2'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 2, spring - Technology and Business Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-K 303', 'BUS-K 304']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Technology and Business Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 2, spring - Legal Environment of Business
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 201', 'BUS-L 293']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Legal Environment of Business'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 2, spring - Financial Reporting and Analysis
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 304', 'BUS-A 307']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Financial Reporting and Analysis'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 2, spring - Global Business Analysis or Global Business Immersion
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-D 271', 'BUS-T 271', 'BUS-W 271']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 2
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Global Business Analysis or Global Business Immersion'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 3, fall - Integrated Core (I-Core)
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-BE 375']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Integrated Core (I-Core)'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 3, spring - Supply Chain Management with Digital Technologies
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-P 319']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Supply Chain Management with Digital Technologies'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 3, spring - Supply Chain Management: Global Sourcing
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-P 320']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Supply Chain Management: Global Sourcing'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 3, spring - Supply Chain Management Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 325', 'BUS-K 327', 'BUS-K 353', 'BUS-P 316', 'BUS-P 356', 'BUS-P 454', 'BUS-S 305', 'BUS-S 307', 'BUS-S 326', 'BUS-S 364', 'BUS-S 400', 'BUS-Z 404']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Supply Chain Management Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 3, spring - Introduction to Business Ethics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-L 375', 'BUS-L 376']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 3
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Introduction to Business Ethics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 4, fall - Operations Processes
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-P 429']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Operations Processes'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 4, fall - Supply Chain Planning & Analytics
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-P 481']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Supply Chain Planning & Analytics'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 4, fall - Strategic Management
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-J 375', 'BUS-Z 304']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Strategic Management'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 4, fall - Compass 3
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-T 375']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'fall'
  AND dr.requirement_name = 'Compass 3'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 4, spring - Supply Chain Management: Logistics and Distribution
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-P 431']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Supply Chain Management: Logistics and Distribution'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 4, spring - Supply Chain Management Elective
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['BUS-A 325', 'BUS-K 327', 'BUS-K 353', 'BUS-P 316', 'BUS-P 356', 'BUS-P 454', 'BUS-S 305', 'BUS-S 307', 'BUS-S 326', 'BUS-S 364', 'BUS-S 400', 'BUS-Z 404']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Supply Chain Management Elective'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

-- Supply Chain Management BSB - Year 4, spring - Fundamentals of Econ for Bus II
INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT dr.id, c.code
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
CROSS JOIN unnest(ARRAY['ECON-B 252']) AS c(code)
WHERE d.major_name = 'Supply Chain Management BSB'
  AND d.school = 'Kelley School of Business'
  AND dr.year = 4
  AND dr.term = 'spring'
  AND dr.requirement_name = 'Fundamentals of Econ for Bus II'
ON CONFLICT (requirement_id, course_code) DO NOTHING;

