export const overviewTableSQL = (extraWhere = '') => `
  /*+engine=mpp*/
  SELECT sum(total) AS total
    , sum(is_check) AS is_check
    , sum(wait_check) AS wait_check
    , sum(score_base) AS score_base
    , sum(score_additional) AS score_additional
    , sum(IF(is_pass = 1, num, 0)) AS is_pass
    , IF(sum(total) = 0, 0, sum(is_check) / sum(total)) AS cover
    , COUNT(DISTINCT(customer)) AS customer
    , IF (
        sum(is_check) = 0
        ,0
        ,(sum(score_base) + sum(score_additional)) / sum(is_check)
    ) AS avgscore
    , IF(
        sum(is_check) = 0
        ,0
        ,sum(IF(is_pass = 1, num, 0)) / sum(is_check)
    ) AS qualifend
    , sum(fst_complain) AS fst_complain
    , sum(fst_complain_pass) AS fst_complain_pass
    , IF(
        sum(fst_complain) = 0
        ,0
        ,sum(fst_complain_pass)/ sum(fst_complain)
    ) AS fst_com_pas_rate
    , sum(aga_complain) AS aga_complain
    , sum(aga_complain_pass) AS aga_complain_pass
    , IF (
        sum(aga_complain) = 0
        ,0
        ,sum(aga_complain_pass)/ sum(aga_complain)
    ) AS aga_com_pas_rate
    , sum(is_fst_resp_otime) AS is_fst_resp_otime
    , sum(is_client_sensitive) AS is_client_sensitive
    , sum(is_customer_sensitive) AS is_customer_sensitive
    , sum(fst_resp_otime) AS fst_resp_otime
    , sum(client_sensitive) AS client_sensitive
    , sum(customer_sensitive) AS customer_sensitive
  FROM rpt_pub_quality_check_std
  WHERE customer IS NOT NULL ${extraWhere};
`;

export const customerOverviewSql = (extraWhere = '') => `
  /*+engine=mpp*/
  SELECT customer
    , sum(total) AS total
    , sum(is_check) AS is_check
    , IF (sum(total) = 0, 0, sum(is_check) / sum(total)) AS cover
    , IF (
        sum(is_check) = 0
        ,0
        ,(sum(score_base) + sum(score_additional)) / sum(is_check)
    ) AS avgscore
    , sum(IF(is_pass = 1, num, 0)) AS pass_count
    , IF(
        sum(is_check) = 0
        ,0
        ,sum(IF(is_pass = 1, num, 0)) / sum(is_check)
    ) AS qualifend
    , sum(fst_complain) AS fst_complain
    , sum(fst_complain_pass) AS fst_complain_pass
    , sum(aga_complain) AS aga_complain
    , sum(aga_complain_pass) AS aga_complain_pass
  FROM rpt_pub_quality_check_std
  WHERE customer IS NOT NULL ${extraWhere}
  GROUP BY customer;
`;

export const issueOverviewSql = (extraWhere = '') => `
  /*+engine=mpp*/
  SELECT  customer_id
    , group_concat(title) as title
    , group_concat(num) as num
    , sum(num) as total
  FROM  (
    SELECT customer_id
      , TRIM(BOTH '"' FROM title) as title
      , COUNT(*) num
    FROM    rpt_pub_quality_error_std
    WHERE 1 =1 ${extraWhere}
    GROUP BY customer_id, title
  )
  WHERE customer_id IS NOT NULL
  GROUP BY customer_id;
`;

export const issueOverviewTitleSql = (extraWhere = '') => `
  /*+engine=mpp*/
  SELECT TRIM(BOTH '"' FROM title) as title
    , COUNT(*) num
    FROM rpt_pub_quality_error_std
  WHERE 1 = 1 ${extraWhere}
  GROUP BY title;
`;

export const scoreTime2replyTime = (extraWhere = '') => `
/*+engine=mpp*/
SELECT MIN(fst_reply_time) AS fst_reply_time, MAX(lat_reply_time) AS lat_reply_time
FROM rpt_pub_quality_date_mapping_std
WHERE 1 = 1 ${extraWhere}
`;

export const getTotalCountByScoretime = (extraWhere = '') => `
/*+engine=mpp*/
SELECT SUM(total) as total
FROM rpt_pub_quality_check_std
WHERE 1 = 1 ${extraWhere}
`;

export const getPerTotalCountByScoretime = (extraWhere = '') => `
/*+engine=mpp*/
SELECT customer, SUM(total) as total
FROM rpt_pub_quality_check_std
WHERE customer IS NOT NULL ${extraWhere}
GROUP BY customer;
`;
