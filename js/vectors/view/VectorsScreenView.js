// Copyright 2016-2018, University of Colorado Boulder

/**
 * Common screen view for vectors screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DisplacementArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/DisplacementArrowNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const ReferenceLineNode = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLineNode' );
  const TwoSpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringScreenView' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );
  const VectorVisibilityControlNode = require( 'MASSES_AND_SPRINGS/vectors/view/VectorVisibilityControlNode' );

  /**
   * @param {VectorsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function VectorsScreenView( model, tandem ) {

    // Calls common two spring view
    TwoSpringScreenView.call( this, model, tandem );
    const self = this;

    // Displacement arrows added for each springs
    const firstDisplacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 0 ].nodeProperty.value.spring.displacementProperty,
      model.naturalLengthVisibleProperty,
      tandem,
      {
        modelViewTransform: this.modelViewTransform,
        left: this.springNodes[ 0 ].nodeProperty.value.right + 8,
        centerY: this.modelViewTransform.modelToViewY( this.springNodes[ 0 ].nodeProperty.value.spring.bottomProperty.value )
      } );
    this.addChild( firstDisplacementArrowNode );

    const secondDisplacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 1 ].nodeProperty.value.spring.displacementProperty,
      model.naturalLengthVisibleProperty,
      tandem,
      {
        modelViewTransform: this.modelViewTransform,
        right: this.springNodes[ 1 ].nodeProperty.value.left + 14,
        centerY: this.modelViewTransform.modelToViewY( this.springNodes[ 1 ].nodeProperty.value.spring.bottomProperty.value )
      } );
    this.addChild( secondDisplacementArrowNode );

    // Equilibrium of mass is dependent on the mass being attached and the visibility of the equilibrium line.
    const firstMassEquilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.firstSpring.massAttachedProperty ],
      function( equilibriumPositionVisible, massAttached ) {
        return !!massAttached && equilibriumPositionVisible;
      } );
    const secondMassEquilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.secondSpring.massAttachedProperty ],
      function( equilibriumPositionVisible, massAttached ) {
        return !!massAttached && equilibriumPositionVisible;
      } );

    // Initializes equilibrium line for first spring
    const firstMassEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.massEquilibriumYPositionProperty,
      firstMassEquilibriumVisibilityProperty, {
        stroke: 'black'
      }
    );

    // Initializes equilibrium line for second spring
    const secondMassEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.secondSpring,
      model.secondSpring.massEquilibriumYPositionProperty,
      secondMassEquilibriumVisibilityProperty, {
        stroke: 'black'
      }
    );

    // Adding system controls to scene graph
    this.addChild( this.springSystemControlsNode );

    // Reference lines from indicator visibility box
    this.addChild( this.firstNaturalLengthLineNode );
    this.addChild( this.secondNaturalLengthLineNode );
    this.addChild( firstMassEquilibriumLineNode );
    this.addChild( secondMassEquilibriumLineNode );
    this.addChild( this.movableLineNode );
    this.addChild( this.massLayer );
    this.addChild( this.toolsLayer );

    // Contains visibility options for the reference lines and displacement arrow
    const indicatorVisibilityControlNode = this.createIndicatorVisibilityPanel( model, false, tandem );

    // Contains all of the display options for the vectors and forces
    const vectorVisibilityControlNode = new VectorVisibilityControlNode(
      model,
      tandem.createTandem( 'vectorVisibilityControlNode' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH+30
      } );

    // VBox that contains all of the panel's content
    const optionsVBox = new VBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        this.gravityAndDampingControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        vectorVisibilityControlNode
      ]
    } );

    // Panel that will display all the toggleable options.
    const optionsPanel = this.createOptionsPanel( optionsVBox, this.rightPanelAlignGroup, tandem );

    // Contains all of the options for the reference lines, gravity, damping, and toolbox
    const rightPanelsVBox = new VBox( { children: [ optionsPanel, self.toolboxPanel ], spacing: this.spacing * 0.9 } );
    this.addChild( rightPanelsVBox );
    rightPanelsVBox.moveToBack();

    // Move this plane to the back of the scene graph
    this.backgroundDragPlane.moveToBack();

    this.visibleBoundsProperty.link( function() {
      rightPanelsVBox.rightTop = new Vector2( self.panelRightSpacing, self.springSystemControlsNode.top );
    } );
  }

  massesAndSprings.register( 'VectorsScreenView', VectorsScreenView );

  return inherit( TwoSpringScreenView, VectorsScreenView );
} );