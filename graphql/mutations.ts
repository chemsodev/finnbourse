export const CREATE_LISTED_COMPANY = `
  mutation CreateListedCompany(
    $nom: String!,
    $secteuractivite: String!,
    $capitalisationboursiere: String!,
    $siteofficiel: String!,
    $phone: String!,
    $email: String!,
    $address: String!,
    $notice: String!
  ) {
    createListedCompany(
      data: {
        nom: $nom,
        secteuractivite: $secteuractivite,
        capitalisationboursiere: $capitalisationboursiere,
        siteofficiel: $siteofficiel,
        contact: {
          phone: $phone,
          email: $email,
          address: $address
        },
        extrafields: {
          notice: $notice
        }
      }
    ) {
      id
    }
  }
`;

export const UPDATE_ORDER_PAYED_WITH_CARD = `
  mutation updateOrderPayedWithCard(
    $id: String!
    $payedwithcard: Boolean!
  ) {
    updateOrder(
      where: { id: $id }
      data: { payedWithCard: { set: $payedwithcard } }
    ) {
      id
    }
  }
`;

export const UPDATE_ORDER_MUTATION = `
  mutation updateOrder(
    $id: String!
    $ordertypeone: String
    $ordertypetwo: String
    $orderdirection: Int
    $securityid: String
    $securitytype: String
    $quantity: Int
    $pricelimitmin: Float
    $pricelimitmax: Float
    $investorid: String
    $negotiatorid: String
    $orderstatus: Int
    $securityissuer: String
    $validity: DateTime
  ) {
    updateOrder(
      where: { id: $id }
      data: {
        ordertypes: { set: [$ordertypeone, $ordertypetwo] }
        orderdirection: $orderdirection
        securityid: $securityid
        securitytype: $securitytype
        quantity: $quantity
        pricelimitmin: $pricelimitmin
        pricelimitmax: $pricelimitmax
        investorid: $investorid
        negotiatorid: $negotiatorid
        orderstatus: $orderstatus
        securityissuer: $securityissuer
        validity: $validity
      }
    ) {
      id
    }
  }
`;

export const DELETE_STOCK = `
 mutation deleteSecurity(
  $securityId: String!
) {
  deleteStock(
    where: { id: $securityId }
  ) {
    id
  }
}
`;
export const DELETE_BOND = `
 mutation deleteBond(
  $securityId: String!
) {
  deleteBond(
    where: { id: $securityId }
  ) {
    id
  }
}
`;

export const CREATE_STOCK = `
  mutation CreateStock(
    $name: String!,
    $isincode: String!,
    $issuer: String!,
    $listedcompanyid: String!,
    $marketlisting: String!,
    $emissiondate: DateTime!,
    $enjoymentdate: DateTime!,
    $quantity: Int!,
    $type: String!,
    $code: String!,
    $facevalue:Float!,
    $closingdate:DateTime,
		$dividendrate:Float
  ) {
    createStock(data: {
      name: $name,
      type: $type,
      isincode: $isincode,
      issuer: $issuer,
      listedcompanyid: $listedcompanyid,
      marketlisting: $marketlisting,
      emissiondate: $emissiondate,
      enjoymentdate: $enjoymentdate,
      quantity: $quantity,
      code: $code,
      facevalue: $facevalue
      closingdate: $closingdate,
      dividendrate: $dividendrate
    }) {
      id
     
    }
  }
`;

export const CREATE_BOND = `
  mutation CreateBond(
    $name: String!
    $code: String!
    $isincode: String!
    $issuer: String!
    $listedcompanyid: String!
    $marketlisting: String!
    $emissiondate: DateTime!
    $enjoymentdate: DateTime!
    $type: String!
    $quantity: Int!
    $facevalue: Float!
    $couponschedule: JSON
    $commission: Float
    $irg: Float
    $tva: Float
    $fixedrate: String
    $variableRate: String
    $estimatedRate: String
    $capitaloperation: String
    $closingdate:DateTime,
    $yieldrate: Float
    $repaymentmethod:String
  ) {
    createBond(data: {
      name: $name
      code: $code
      isincode: $isincode
      issuer: $issuer
      listedcompanyid: $listedcompanyid
      marketlisting: $marketlisting
      emissiondate: $emissiondate
      enjoymentdate: $enjoymentdate
      type: $type
      quantity: $quantity
      facevalue: $facevalue
      couponschedule: $couponschedule
      commission: $commission
      irg: $irg
      tva: $tva
      fixedrate: $fixedrate
      variablerate: $variableRate
      estimatedrate: $estimatedRate
      capitaloperation: $capitaloperation
      closingdate: $closingdate,
      yieldrate: $yieldrate
      repaymentmethod: $repaymentmethod
    }) {
      id
    }
  }
`;

export const COUPON_SCHEDULE_INPUT = `
  input CouponScheduleInput {
    year: Int!
    rate: Float!
  }
`;

export const DELETE_ORDER = `
mutation deleteOrder(
  $orderId: String!
) {
  deleteOrder(
    where: { id: $orderId }
  ) {
    id
  }
}
`;

export const BAN_USER = `
  mutation DeleteUser($userid: String!) {
    deleteUser(where: { id: $userid }) {
      id
      fullname
    }
  }
`;

export const UPDATE_USER_ROLE = `
  mutation updateUserRole(
  $userid: String!
  $roleid: Int!
) {
  updateUser(
    where: { id: $userid }
    data: { roleid: { set: $roleid } }
  ) {
    id
  }
}
`;
export const VALIDATE_USER = `
  mutation updateUserRole(
  $userid: String!
  $roleid: Int!
  $negotiatorid: String!
) {
  updateUser(
    where: { id: $userid }
    data: { roleid: { set: $roleid }, negotiatorid: { set: $negotiatorid } }
  ) {
    id
  }
}
`;
export const UPDATE_NOTIFICATION_STATUS = `
  mutation updateNotidicationStatus(
  $notifid: String!
  $readstatus: Boolean!
) {
  updateNotification(
    where: { id: $notifid }
    data: { readstatus: { set: $readstatus } }
  ) {
    id
  }
}
`;
export const CREATE_NEWS_ARTICLE_MUTATION = `  
mutation CreateNewsArticle(
  $writerid: String!,
  $ispublished: Boolean,
  $title: String!,
  $content: String!,
  $language: String!
) {
  createNewsArticle(
    data: {
      writerid: $writerid,
      ispublished: $ispublished,
      title: $title,
      content: $content,
      language: $language
    }
  ) {
    id
  
  }
}`;
export const DELETE_NEWS_ARTICLE = `
  mutation DeleteNewsArticle($id: String!) {
    deleteNewsArticle(where: { id: $id }) {
      id
    }
  }
`;

export const DELETE_QUESTION = `
  mutation DeleteQuestion($id: String!) {
    deleteSupportqa(where: { id: $id }) {
      id
    }
  }
`;
export const CREATE_ORDER_MUTATION = `
  mutation createOrder(
    $ordertypeone: String!
    $ordertypetwo: String!
    $orderdirection: Int!
    $securityid: String!
    $securitytype: String!
    $quantity: Int!
    $pricelimitmin: Float
    $pricelimitmax: Float
    $investorid: String!
    $negotiatorid: String!
    $orderstatus: Int!
    $securityissuer: String!
    $validity: DateTime

  ) {
    createOrder(
      data: {
        ordertypes: { set: [$ordertypeone, $ordertypetwo] }
        orderdirection: $orderdirection
        securityid: $securityid
        securitytype: $securitytype
        quantity: $quantity
        pricelimitmin: $pricelimitmin
        pricelimitmax: $pricelimitmax
        investorid: $investorid
        negotiatorid: $negotiatorid
        orderstatus: $orderstatus
        securityissuer: $securityissuer
        validity: $validity
      }
    ) {
      id
    }
  }
`;

export const UPDATE_SUPPORT_MESSAGE = `
  mutation UpdateSupportqa($id: String!, $answer: String!, $state: Int!) {
    updateSupportqa(where: { id: $id }, data: { answer: { set: $answer }, state: { set: $state }}) {
      id
    }
  } 
`;

export const UPDATE_USER_NEGOTIATOR = `
  mutation UpdateUserNegotiator($id: String!, $negotiatorid: String!) {
    updateUser(where: { id: $id }, data: { negotiatorid: { set: $negotiatorid }}) {
      id
    }
  }
`;

export const INSERT_DATA = `
mutation CreateManyData($input: [DataCreateManyInput!]!) {
  createManyData(data: $input) {
    count
  }
}
`;
export const CREATE_SUPPORT_MESSAGE = `
 mutation CreateSupportqa(
  $userid: String!,
  $question: String!,
  $answer: String!,
  $state: Int!,
  $description: String!,
  $language: String!,
  $ispublished: Boolean!
) {
  createSupportqa(
    data: {
      userid: $userid,
      question: $question,
      answer: $answer,
      state: $state,
      description: $description,
      language: $language,
      ispublished: $ispublished
    }
  ) {
    id
  
  }
}
`;

export const UPDATE_LISTED_COMPANY = `
  mutation UpdateListedCompany(
    $id: String!,
    $nom: String!,
    $secteuractivite: String!,
    $capitalisationboursiere: String!,
    $siteofficiel: String!,
    $phone: String!,
    $email: String!,
    $address: String!,
    $notice: String!
  ) {
    updateListedCompany(
      where: { id: $id },
      data: {
        nom: { set: $nom },
        secteuractivite: { set: $secteuractivite },
        capitalisationboursiere: { set: $capitalisationboursiere },
        siteofficiel: { set: $siteofficiel },
        contact: {
          phone: { set: $phone },
          email: { set: $email },
          address: { set: $address }
        },
        extrafields: {
          notice: $notice
        }
      }
    ) {
      id
    }
  }
`;

export const DELETE_LISTED_COMPANY = `
 mutation DeleteListedCompany($id: String!) {
  deleteListedCompany(where: { id: $id }) {
    id
  }
}

`;
