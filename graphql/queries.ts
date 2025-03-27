export const LIST_STOCKS_QUERY = `
  query ListStocks ($type: String,$take:Int,$skip:Int){
    listStocks(take: $take, skip: $skip, where: { type: { equals: $type } }) {
      id
      type
      name
      isincode
      issuer
      code
      listedcompanyid
      marketlisting
      emissiondate
      emissiondate
      enjoymentdate
      quantity
      shareclass
      votingrights
      dividendinfo
      facevalue
      marketmetadata
      closingdate
		  dividendrate
    }
  }
`;

export const LIST_TWO_STOCKS_QUERY = `
  query ListStocks ($type: String,$idOne: String!,$idTwo: String!){
    listStocks(where: {id: {in: [$idOne,$idTwo]} , type: { equals: $type } }) {
      id
      type
      name
      isincode
      issuer
      code
      listedcompanyid
      marketlisting
      emissiondate
      emissiondate
      enjoymentdate
      quantity
      shareclass
      votingrights
      dividendinfo
      facevalue
      marketmetadata
      closingdate
		  dividendrate
    }
  }
`;

export const LIST_STOCKS_SIMPLE_QUERY = `
  query ListStocks ($take: Int , $type: String) {
    listStocks(take: $take, where: { type: { equals: $type } }) {
      id
      issuer
      facevalue
      code
      marketmetadata
    }
  }
`;
export const LIST_BOND_QUERY = `
  query ListBonds($type: String) {
    listBonds(where: { type: { equals: $type } }) {
     	id
      type
      name
      isincode
      issuer
      code
      listedcompanyid
      marketlisting
      emissiondate
      emissiondate
      enjoymentdate
      quantity
      maturitydate
      couponrate
      couponschedule
      repaymentmethod
      yieldrate
      facevalue
      marketmetadata
      closingdate
      
    }
  }
`;
export const LIST_STOCKS_NAME_PRICE_QUERY = `
  query ListStocks($type: String) {
    listStocks(where: { type: { equals: $type } }) {
      id
      type
      issuer
      name
      facevalue
    }
  }
`;

export const LIST_BONDS_NAME_PRICE_QUERY = `
  query ListBonds ($type: String) {
    listBonds(where: { type: { equals: $type } }) {
      id
      type
      name
      facevalue
      issuer

    }
  }
`;

export const FIND_UNIQUE_STOCKS_QUERY = `
  query FindUniqueStock($id: String,$type: String) {
    findUniqueStock(where: { id: $id, type: { equals: $type} }) {
      id
      type
      name
      isincode
      issuer
      listedcompanyid
      marketlisting
      emissiondate
      enjoymentdate
      quantity
      shareclass
      votingrights
      dividendinfo
      code
      facevalue
    }
  }
`;

export const FIND_UNIQUE_BOND_QUERY = `
  query FindUniqueBond($id: String,$type: String) {
    findUniqueBond(where: { id: $id, type: { equals: $type } }) {
      id
      type
      name
      isincode
      issuer
      listedcompanyid
      marketlisting
      emissiondate
      enjoymentdate
      maturitydate
      quantity
      code
      facevalue
      couponschedule
      repaymentmethod
      yieldrate
    }
  }
`;

export const FIND_UNIQUE_LISTED_COMPANY_QUERY = `
  query FindUniqueListedCompany($id: String) {
    findUniqueListedCompany(where: { id: $id }) {
      id
      nom
      secteuractivite
      capitalisationboursiere
      siteofficiel
      contact
      extrafields
    }
  }
`;
export const FIND_UNIQUE_LISTED_COMPANY_EXTRA_FIELDS_QUERY = `
  query FindUniqueListedCompany($id: String) {
    findUniqueListedCompany(where: { id: $id }) {
      extrafields
    }
  }
`;

export const LIST_NEGOCIATEURS_QUERY = `
  query ListNegociateurs {
    listUsers(where:{roleid:{equals:2}}) {
      id
      fullname
    }
  }
`;
export const FIND_UNIQUE_USER = `
  query GetUser($userid: String) {
    findUniqueUser(where: { id: $userid }) {
      id
      fullname
      email
      phonenumber
      followsbusiness
      roleid
      status
    }
  }
`;
export const LIST_ORDERS_SIMPLE = `query GetOrdersSimple ($orderid: String) {
  findUniqueOrder (where: { id: $orderid }){
    id
		ordertypes
		orderdirection
		securityissuer
		securityid
		quantity
		pricelimitmin
		pricelimitmax
		validity
    duration
		orderdate
		investorid
		negotiatorid
    createdat
  }
}`;
export const LIST_ORDERS_QUERY_PDF = `
  query ListOrders {
    listOrdersExtended(
      where: { orderstatus: { equals: 1} }
      include: {
        dynamic: { tableColumn: "securitytype", idColumn: "securityid" }
        manual: [
          { table: "user", foreignKey: "investorid" }
          { table: "user", foreignKey: "negotiatorid" }
        ]
      }
    ) {
      id
      ordertypes
      orderdirection
      securityid
      securitytype
      quantity
      pricelimitmin
      pricelimitmax
      duration
      orderdate
      orderstatus
      investorid
      negotiatorid
      securityissuer
      signeddocumnet
      validity
      createdat
    }
  }
`;
export const GET_REST_USER_DATA = `
  query GetUserData($userId: String!, $type: String!) {
    listData(where: { userid: { equals: $userId }, type: { equals: $type } }) {
      id
      name
      data
      type
      userid
    }
  }
`;

export const LIST_ORDERS_QUERY = `
  query ListOrders($investorid: String, $skip: Int, $take: Int, $searchquery: String,$state: Int, $orderId: String) {
    listOrdersExtended(
      skip: $skip
      take: $take
      where: {
        investorid: { equals: $investorid } 
        securityissuer: { contains: $searchquery, mode: insensitive }
        securityissuer: { id: $orderId }
        orderstatus: { equals: $state} 
      }
      include: {
        dynamic: { tableColumn: "securitytype", idColumn: "securityid" }
        manual: [
          { table: "user", foreignKey: "investorid" }
          { table: "user", foreignKey: "negotiatorid" }
        
        ]
      }
    ) {
      id
      ordertypes
      orderdirection
      securityid
      securitytype
      quantity
      pricelimitmin
      pricelimitmax
      duration
      orderdate
      orderstatus
      investorid
      negotiatorid
      securityissuer
      signeddocumnet
      validity
      createdat
    }
  }
`;

export const LIST_SUPPORT_QUERY = `
 query ListSupportqas($language: String, $state: Int, $ispublished: Boolean, $skip: Int, $take: Int) {
  listSupportqas(
    skip: $skip
    take: $take
    where: {
      language: { equals: $language }
      state: { equals: $state }
      ispublished: { equals: $ispublished }
    }
  ) {
    id
    question
    answer
    state
    language
    userid
    ispublished
    description
    userid
  }
}
 
`;

export const CALCULATE_TOTAL_WALLET_VALUE = `
query GetTotalValue($userid: String) {
  aggregatePortfolio(
		where:{
			userid: {
				equals: $userid
			}
		}
    _sum: { totalPayed: true }
  ) {
    _sum {
      totalPayed
    }
  }
  } `;
export const LIST_ORDERS_QUERY_ONE_ORDER = `
  query FindUniqueOrder($orderid: String) {
    listOrdersExtended(
      where: { id: { equals: $orderid } }
      include: {
        dynamic: { tableColumn: "securitytype", idColumn: "securityid" }
        manual: [
          { table: "user", foreignKey: "investorid" }
          { table: "user", foreignKey: "negotiatorid" }
        ]
      }
    ) {
      id
      ordertypes
      orderdirection
      securityid
      securitytype
      quantity
      pricelimitmin
      pricelimitmax
      duration
      orderdate
      orderstatus
      investorid
      negotiatorid
      securityissuer
      signeddocumnet
      payedWithCard
      validity
      createdat
    }
  }
`;
export const LIST_USERS_QUERY = `
  query ListUsers(
    $skip: Int
    $take: Int
    $searchquery: String
    $roleid: Int
    $negotiatorid: String
  ) {
    listUsers(
      skip: $skip
      take: $take
      where: {
        fullname: { contains: $searchquery,	mode: insensitive }
        roleid: { equals: $roleid }
        
        negotiatorid: { equals: $negotiatorid }
      }
    ) {
      id
      fullname
      email
      phonenumber
      followsbusiness
      roleid
      negotiatorid

    }
  }

`;

export const LIST_PORTFOLIIOS_QUERY = `
  query ListPortfolios(
    $skip: Int
    $take: Int
    $searchquery: String
    $userid: String
  ) {
    listPortfolios(
      skip: $skip
      take: $take
      where: {
        issuer: { contains: $searchquery,	mode: insensitive }
        userid: { equals: $userid } 
      }
    ) {
    id
		userid
		issuer
		assettype
		assetid
		quantity
		totalPayed
    }
  }
`;

export const GET_NEWS_QUERY = `
  query GetNews($language: String, $skip: Int, $take: Int) {
    listNewsArticles(
      skip: $skip
      take: $take
      where: { language: { equals: $language } }
    ) {
      id
      writerid
      ispublished
      title
      content
      language
    }
  }
`;

//add languages :   where: { language: { equals: $language } }
export const GET_NOTIFICATIONS_QUERY = `
  query GetNotifications( $skip: Int, $take: Int) {
    listNotifications(
      skip: $skip
      take: $take
    ) {
      id
      userid
      message
      readstatus
      url
      createdat
    }
  }
`;

export const GET_SUPPORT_QUESTIONS_QUERY = `
  query GetSupportQuestions($language: String, $skip: Int, $take: Int, $state: Int, $ispublished: Boolean) {
    listSupportqas(
      skip: $skip
      take: $take
     where: {
      language: { equals: $language }
      state: { equals: $state }
      ispublished: { equals: $ispublished }

    }
    ) {
      id
      question
      answer
      state
      language
      description
      userid
    }
  }
`;

export const GET_LISTED_COMPANIES_QUERY = `query{
  listListedCompanies{
    id
    nom
    extrafields
  }
}`;

export const COUNT_ORDERS_STATE_ONE_QUERY = `
  query COUNT_ORDERS_STATE_ONE_QUERY($negotiatorid: String) {
     aggregateOrder(
			_count: {
				_all: true
			}
			where: {
				negotiatorid:{
					equals: $negotiatorid
				}
				orderstatus: {
					equals: 1
				}
			}
		){
			_count{
				_all
			}
		}
    }`;

export const COUNT_UNOPENED_MESSAGES_QUERY = `
  query {
     aggregateSupportqa(
			_count: {
				_all: true
			}
			where: {
				state: {
					equals: 0
				}
			}
		){
			_count{
				_all
			}
		}
    }`;

export const COUNT_VALIDATED_ORDERS_QUERY = `
  query COUNT_ORDERS_STATE_QUERY($negotiatorid: String, $startOfWeek: DateTime, $endOfWeek: DateTime) {
  aggregateOrder(
    _count: {
      _all: true
    }
    where: {
      negotiatorid: {
        equals: $negotiatorid
      }
      orderstatus: {
        in: [3, 8]
      }
      updatedat: {
        gte: $startOfWeek
        lte: $endOfWeek
      }
    }
  ) {
    _count {
      _all
    }
  }
}
`;

export const PORTFOLIO_PERFORMANCE_QUERY = `
  query PortfolioPerformance ($userid: String) {
	listOrdersExtended(
		
		where: {
			investorid: {
				equals: $userid
			}
			orderstatus: {
				in: [3,4]
			}
		}
		include: {
			dynamic: {
				tableColumn: "securitytype"
				idColumn: "securityid"
			}
		}
	){
		id
		orderdirection
		securityissuer
		securityid
		securitytype
		quantity
		validatedquantity
		validatedprice
		investorid
    createdat
	}	}
`;

export const ORDER_HISTORY_QUERY = `
 query orderHistory ($userid: String) {
groupByOrder(
		where:{
			investorid: {
				equals: $userid
			}
			orderstatus: {
				in: [0,1,2,3,4,8]
			}
		}
    by: [orderstatus]

    orderBy: { _sum: { validatedprice: desc } }
		_count:{
			id: true
		}
  ) {
    orderstatus

    _count {
      id
    }
  }	}
`;

export const HISTORIQUE_EXECUTION_ORDRE_QUERY = `
 query histExOr ($userid: String){
groupByOrder(
		where:{
			negotiatorid: {
				equals: $userid
			}
			orderstatus: {
				in: [0,1,2,3,4,8]
			}
		}
    by: [orderstatus]
    _sum: { validatedprice: true validatedquantity: true}
    orderBy: { _sum: { validatedprice: desc } }
		_count:{
			id: true
		}
  ) {
    orderstatus
    _sum {
      validatedprice
			validatedquantity
    }
    _count {
      id
    }
  }
}
`;

export const VUE_ENSEMBLE_TRANSACTIONS_QUERY = `
 query histExOr ($userid: String){
groupByOrder(
		where:{
			negotiatorid: {
				equals: $userid
			}
			orderstatus: {
				in: [0,1,2,3,4,8]
			}
		}
    by: [securityissuer]
    _sum: { validatedprice: true validatedquantity: true}
    orderBy: { _sum: { validatedprice: desc } }
		_count:{
			id: true
		}
  ) {
    securityissuer
    _sum {
      validatedprice
			validatedquantity
    }
    _count {
      id
    }
  }
}
`;

export const PERF_PLATEFORME_QUERY = `
query{
groupByOrder(
		where:{
			orderstatus: {
				in: [0,1,2,3,4,8]
			}
		}
    by: [securityissuer]
    _sum: { validatedprice: true validatedquantity: true}
    orderBy: { _sum: { validatedprice: desc } }
		_count:{
			id: true
		}
  ) {
    securityissuer
    _sum {
      validatedprice
			validatedquantity
    }
    _count {
      id
    }
  }
}
`;
export const PERF_NEGOCIATEURS_QUERY = `
query{
groupByOrder(
		where:{
			orderstatus: {
				in: [0,1,2,3,4,8]
			}
		}
    by: [negotiatorid]
    _sum: { validatedprice: true validatedquantity: true}
    orderBy: { _sum: { validatedprice: desc } }
		_count:{
			id: true
		}
  ) {
    negotiatorid
    _sum {
      validatedprice
			validatedquantity
    }
    _count {
      id
    }
  }
}
`;
export const GROUP_BY_PORTFOLIIOS_QUERY = `
query GroupByPortfolio(
    $userid: String
  ) { 
    groupByPortfolio(
			
			where:{
			userid: {
				equals: $userid
			}
			}
			_sum:{
				quantity: true
				totalPayed: true
			}
			by: [assetid,	issuer]
			orderBy: {
				_sum: {quantity: desc
			}
			}
		) {
		issuer
		assetid
		_sum {
		totalPayed
		quantity
    }
  }  }
`;
export const LIST_ORDERS_QUERY_EXCEL = `
  query ListOrders {
    listOrdersExtended(
      where: { orderstatus: { in: [1,3,8]} }
      include: {
        dynamic: { tableColumn: "securitytype", idColumn: "securityid" }
        manual: [
          { table: "user", foreignKey: "investorid" }
          { table: "user", foreignKey: "negotiatorid" }
        ]
      }
    ) {
      id
      ordertypes
      orderdirection
      securityid
      securitytype
      quantity
      pricelimitmin
      pricelimitmax
      duration
      orderdate
      orderstatus
      investorid
      negotiatorid
      securityissuer
      validity
      createdat
    }
  }
`;

export const LIST_LISTED_COMPANIES = `
  query ListListedCompanies {
    listListedCompanies {
      id
      nom
      secteuractivite
      capitalisationboursiere
      contact
      siteofficiel
      extrafields
    }
  }
`;
