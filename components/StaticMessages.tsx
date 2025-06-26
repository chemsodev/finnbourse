/**
 * Static version of Messages component that uses mock data instead of GraphQL
 */

"use client";

import React, { useState } from "react";
import { MessageCircle, User, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for support questions and messages
const mockSupportQuestions = [
  {
    id: "1",
    question: "Comment puis-je modifier mes informations personnelles ?",
    status: "PENDING",
    createdAt: "2024-12-16T10:30:00Z",
    user: {
      id: "user1",
      fullname: "Jean Dupont",
      email: "jean.dupont@example.com",
    },
    messages: [
      {
        id: "msg1",
        content:
          "J'aimerais modifier mon adresse et mon numéro de téléphone dans mon profil. Comment puis-je procéder ?",
        createdAt: "2024-12-16T10:30:00Z",
        isFromUser: true,
      },
      {
        id: "msg2",
        content:
          "Bonjour, vous pouvez modifier vos informations en allant dans votre profil utilisateur. Si vous avez des difficultés, notre équipe peut vous aider.",
        createdAt: "2024-12-16T14:20:00Z",
        isFromUser: false,
      },
    ],
  },
  {
    id: "2",
    question: "Problème de connexion à la plateforme",
    status: "RESOLVED",
    createdAt: "2024-12-15T16:45:00Z",
    user: {
      id: "user2",
      fullname: "Marie Martin",
      email: "marie.martin@example.com",
    },
    messages: [
      {
        id: "msg3",
        content:
          "Je n'arrive pas à me connecter avec mes identifiants habituels. Le système me dit que mon mot de passe est incorrect.",
        createdAt: "2024-12-15T16:45:00Z",
        isFromUser: true,
      },
      {
        id: "msg4",
        content:
          "Nous avons identifié le problème. Votre compte a été temporairement verrouillé pour sécurité. Nous l'avons déverrouillé.",
        createdAt: "2024-12-15T17:30:00Z",
        isFromUser: false,
      },
      {
        id: "msg5",
        content:
          "Merci beaucoup ! Je peux maintenant me connecter sans problème.",
        createdAt: "2024-12-15T18:00:00Z",
        isFromUser: true,
      },
    ],
  },
  {
    id: "3",
    question: "Question sur les frais de transaction",
    status: "PENDING",
    createdAt: "2024-12-16T09:15:00Z",
    user: {
      id: "user3",
      fullname: "Pierre Dubois",
      email: "pierre.dubois@example.com",
    },
    messages: [
      {
        id: "msg6",
        content:
          "Pouvez-vous m'expliquer la structure des frais pour les transactions d'actions ? J'ai remarqué des variations selon le montant.",
        createdAt: "2024-12-16T09:15:00Z",
        isFromUser: true,
      },
    ],
  },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          En attente
        </Badge>
      );
    case "RESOLVED":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Résolu
        </Badge>
      );
    default:
      return <Badge variant="secondary">Inconnu</Badge>;
  }
};

export default function StaticMessages() {
  const [selectedQuestion, setSelectedQuestion] = useState<any>(
    mockSupportQuestions[0]
  );

  const pendingQuestions = mockSupportQuestions.filter(
    (q) => q.status === "PENDING"
  );
  const resolvedQuestions = mockSupportQuestions.filter(
    (q) => q.status === "RESOLVED"
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Gestion des Messages de Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                Tous ({mockSupportQuestions.length})
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="flex items-center space-x-1"
              >
                <AlertCircle className="h-4 w-4" />
                <span>En attente ({pendingQuestions.length})</span>
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Résolus ({resolvedQuestions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Liste des questions */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">
                    Questions de Support
                  </h3>
                  {mockSupportQuestions.map((question) => (
                    <Card
                      key={question.id}
                      className={`cursor-pointer transition-colors ${
                        selectedQuestion?.id === question.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">
                            {question.question}
                          </h4>
                          {getStatusBadge(question.status)}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
                          <User className="h-3 w-3" />
                          <span>{question.user.fullname}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{formatDate(question.createdAt)}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {question.messages.length} message
                          {question.messages.length > 1 ? "s" : ""}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Détails de la question sélectionnée */}
                <div>
                  {selectedQuestion && (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {selectedQuestion.question}
                            </CardTitle>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              Par {selectedQuestion.user.fullname} (
                              {selectedQuestion.user.email})
                            </p>
                          </div>
                          {getStatusBadge(selectedQuestion.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {selectedQuestion.messages.map((message: any) => (
                            <div
                              key={message.id}
                              className={`p-3 rounded-lg ${
                                message.isFromUser
                                  ? "bg-blue-100 dark:bg-blue-900/20 ml-4"
                                  : "bg-slate-100 dark:bg-slate-800 mr-4"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-medium">
                                  {message.isFromUser
                                    ? selectedQuestion.user.fullname
                                    : "Support"}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {formatDate(message.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm">{message.content}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {pendingQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{question.question}</h4>
                        {getStatusBadge(question.status)}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <User className="h-4 w-4" />
                        <span>{question.user.fullname}</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{formatDate(question.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resolved" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {resolvedQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{question.question}</h4>
                        {getStatusBadge(question.status)}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <User className="h-4 w-4" />
                        <span>{question.user.fullname}</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{formatDate(question.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
