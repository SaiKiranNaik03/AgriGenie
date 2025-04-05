"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Leaf } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface Disease {
  name: string;
  probability: number;
  description?: string;
  treatment?: string;
}

interface TreatmentPlan {
  immediate_steps: string[];
  long_term_prevention: string[];
  organic_alternatives: string[];
  chemical_solutions: string[];
}

interface AssessmentResult {
  diseases: Disease[];
  treatment_plan: TreatmentPlan;
  imageUrl: string;
}

export default function FarmerAssess() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingTreatment, setIsGeneratingTreatment] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const generateTreatmentPlan = async (diseases: Disease[]) => {
    try {
      const prompt = `Act as a plant pathologist. For these detected diseases: ${diseases
        .map((d) => `${d.name} (${(d.probability * 100).toFixed(1)}% confidence)`)
        .join(", ")}. 
        Provide:
        1. Immediate treatment steps
        2. Long-term prevention strategies
        3. Organic alternatives
        4. Chemical solutions (if necessary)
        Format as JSON with markdown formatting in descriptions.`;

      const response = await fetch('/api/generate-treatment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diseases, prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate treatment plan');
      }

      const data = await response.json();
      
      // Validate the response structure
      if (!data.immediate_steps || !data.long_term_prevention || 
          !data.organic_alternatives || !data.chemical_solutions) {
        throw new Error('Invalid treatment plan format');
      }

      return data;
    } catch (error) {
      console.error('Error generating treatment plan:', error);
      // Return a fallback treatment plan
      return {
        immediate_steps: [
          "Isolate affected plants to prevent spread",
          "Remove and destroy severely infected parts",
          "Monitor plant health daily"
        ],
        long_term_prevention: [
          "Maintain proper plant spacing for air circulation",
          "Follow recommended watering practices",
          "Regular inspection of plants"
        ],
        organic_alternatives: [
          "Use neem oil solution",
          "Apply baking soda spray",
          "Try garlic-based natural fungicide"
        ],
        chemical_solutions: [
          "Consult with a local agricultural expert for specific chemical treatments",
          "Follow safety guidelines when using chemical treatments"
        ]
      };
    }
  };

  const handleAssess = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to assess",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]);
        };
        reader.readAsDataURL(selectedImage);
      });

      // Call Plant.id API
      const response = await fetch('https://api.plant.id/v2/health_assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.NEXT_PUBLIC_CROP_HEALTH_API_KEY || '',
        },
        body: JSON.stringify({
          images: [`data:image/jpeg;base64,${base64Image}`],
          organs: ["leaf", "flower"],
          health_assessment: true,
          details: ["disease", "description", "treatment"],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assess plant health');
      }

      const data = await response.json();
      
      // Set initial result with diseases
      setResult({
        diseases: data.health_assessment.diseases,
        treatment_plan: {
          immediate_steps: [],
          long_term_prevention: [],
          organic_alternatives: [],
          chemical_solutions: [],
        },
        imageUrl: previewUrl,
      });

      // Generate treatment plan
      setIsGeneratingTreatment(true);
      try {
        const treatmentPlan = await generateTreatmentPlan(data.health_assessment.diseases);
        setResult(prev => prev ? {
          ...prev,
          treatment_plan: treatmentPlan
        } : null);
      } catch (error) {
        console.error('Error generating treatment plan:', error);
        toast({
          title: "Treatment Plan Generation Failed",
          description: "We couldn't generate a treatment plan, but you can still see the disease diagnosis.",
          variant: "destructive",
        });
      } finally {
        setIsGeneratingTreatment(false);
      }

      toast({
        title: "Assessment Complete",
        description: "Plant health assessment has been completed successfully",
      });
    } catch (error) {
      console.error('Error assessing plant health:', error);
      toast({
        title: "Assessment Failed",
        description: "Failed to assess plant health. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Crop Health Assessment</h1>
          <p className="text-muted-foreground">
            Upload an image of your crop to assess its health and get treatment recommendations
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Select an image of your crop's leaves or flowers for assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="image">Crop Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={isLoading}
              />
            </div>
            {previewUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    <p>Drag and drop your image here, or click to select</p>
                    <p className="text-xs mt-1">Supported formats: JPG, PNG, JPEG</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium">Tips for best results:</h4>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      <li>Take clear, well-lit photos</li>
                      <li>Focus on affected areas</li>
                      <li>Include multiple angles</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">What to avoid:</h4>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      <li>Blurry or dark images</li>
                      <li>Multiple plants in one shot</li>
                      <li>Distant or unclear views</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            <Button
              onClick={handleAssess}
              disabled={!selectedImage || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assessing...
                </>
              ) : (
                <>
                  <Leaf className="mr-2 h-4 w-4" />
                  Assess Health
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result ? (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Results</CardTitle>
              <CardDescription>
                Detailed analysis of your crop's health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="diseases">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="diseases">Diseases</TabsTrigger>
                  <TabsTrigger value="treatment">Treatment Plan</TabsTrigger>
                </TabsList>
                <TabsContent value="diseases" className="space-y-4">
                  {result.diseases.map((disease, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{disease.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {(disease.probability * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                      <Progress value={disease.probability * 100} />
                      {disease.description && (
                        <p className="text-sm text-muted-foreground">
                          {disease.description}
                        </p>
                      )}
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="treatment" className="space-y-4">
                  {isGeneratingTreatment ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-muted rounded animate-pulse" />
                          <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-muted rounded animate-pulse" />
                          <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-muted rounded animate-pulse" />
                          <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Immediate Steps</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          {result.treatment_plan.immediate_steps.map((step, index) => (
                            <li key={index} className="text-sm">{step}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Long-term Prevention</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          {result.treatment_plan.long_term_prevention.map((step, index) => (
                            <li key={index} className="text-sm">{step}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Organic Alternatives</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          {result.treatment_plan.organic_alternatives.map((alt, index) => (
                            <li key={index} className="text-sm">{alt}</li>
                          ))}
                        </ul>
                      </div>
                      {result.treatment_plan.chemical_solutions.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Chemical Solutions</h3>
                          <ul className="list-disc pl-4 space-y-1">
                            {result.treatment_plan.chemical_solutions.map((sol, index) => (
                              <li key={index} className="text-sm">{sol}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>
                Understanding the crop health assessment process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">1. Upload Image</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a clear image of your crop's leaves or flowers showing any visible issues.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Loader2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">2. AI Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI analyzes the image to identify potential diseases and issues.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">3. Get Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive detailed diagnosis and treatment recommendations.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Need help?</h4>
                <p className="text-sm text-muted-foreground">
                  If you're unsure about the results or need additional guidance, our agricultural experts are here to help.
                  Contact us through the support chat for personalized assistance.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
