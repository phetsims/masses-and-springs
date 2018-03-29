// Copyright 2016-2018, University of Colorado Boulder

/**
 * Common screen view for vectors screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );

  var IndicatorVisibilityControlNode = require( 'MASSES_AND_SPRINGS/vectors/view/IndicatorVisibilityControlNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var GravityAndDampingControlNode = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlNode' );
  var TwoSpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringScreenView' );
  var Panel = require( 'SUN/Panel' );
  var ReferenceLineNode = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLineNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VectorVisibilityControlNode = require( 'MASSES_AND_SPRINGS/vectors/view/VectorVisibilityControlNode' );
  var DisplacementArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/DisplacementArrowNode' );

  // constants
  var EQUILIBRIUM_LINE_FILL = 'black';

  /**
   * @param {VectorsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function VectorsScreenView( model, tandem ) {

    // Calls common two spring view
    TwoSpringScreenView.call( this, model, tandem );
    var self = this;

    // Displacement arrows added for each springs
    var firstDisplacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 0 ].spring.displacementProperty,
      model.naturalLengthVisibleProperty,
      tandem,
      {
        modelViewTransform: this.modelViewTransform,
        left: this.springNodes[ 0 ].right + 8,
        centerY: this.modelViewTransform.modelToViewY( this.springNodes[ 0 ].spring.bottomProperty.value )
      } );
    this.addChild( firstDisplacementArrowNode );

    var secondDisplacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 1 ].spring.displacementProperty,
      model.naturalLengthVisibleProperty,
      tandem,
      {
        modelViewTransform: this.modelViewTransform,
        right: this.springNodes[ 1 ].left + 14,
        centerY: this.modelViewTransform.modelToViewY( this.springNodes[ 1 ].spring.bottomProperty.value )
      } );
    this.addChild( secondDisplacementArrowNode );

    // Equilibrium of mass is dependent on the mass being attached and the visibility of the equilibrium line.
    var firstMassEquilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.firstSpring.massAttachedProperty ],
      function( equilibriumPositionVisible, massAttached ) {
        //REVIEW: return massAttached && equilibriumPositionVisible;
        if ( massAttached ) {
          return equilibriumPositionVisible;
        }
        else {
          return false;
        }
      } );
    var secondMassEquilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.secondSpring.massAttachedProperty ],
      function( equilibriumPositionVisible, massAttached ) {
        //REVIEW: return massAttached && equilibriumPositionVisible;
        if ( massAttached ) {
          return equilibriumPositionVisible;
        }
        else {
          return false;
        }
      } );
    //REVIEW: Some duplication for things for each spring. Is there an easy/moderate way to remove this? If not no worries

    // Initializes equilibrium line for first spring
    var firstSpringEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.massEquilibriumYPositionProperty,
      firstMassEquilibriumVisibilityProperty, {
        stroke: EQUILIBRIUM_LINE_FILL
      }
    );

    // Initializes equilibrium line for second spring
    var secondSpringEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.secondSpring,
      model.secondSpring.massEquilibriumYPositionProperty,
      secondMassEquilibriumVisibilityProperty, {
        stroke: EQUILIBRIUM_LINE_FILL
      }
    );

    //REVIEW: Style guide wants one space after //
    //Reference lines from indicator visibility box
    this.addChild( firstSpringEquilibriumLineNode );
    this.addChild( secondSpringEquilibriumLineNode );

    //REVIEW: Style guide wants one space after //
    //We do this to prevent overlap with the massNodes.
    firstSpringEquilibriumLineNode.moveToBack();
    secondSpringEquilibriumLineNode.moveToBack();

    // Contains visibility options for the reference lines and displacement arrow
    //REVIEW: the margins/whatnot are somewhat duplicated.
    var indicatorVisibilityControlNode = new IndicatorVisibilityControlNode(
      model,
      tandem.createTandem( 'indicatorVisibilityControlNode' ), {
        //REVIEW: this maxWidth/xMargin/yMargin combo is repeated a lot. If not too hard, can it be factored out?
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 0,
        yMargin: 0,
        stroke: null
      } );

    // Contains all of the display options for the vectors and forces
    var vectorVisibilityControlNode = new VectorVisibilityControlNode(
      model,
      tandem.createTandem( 'vectorVisibilityControlNode' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 0,
        yMargin: 0,
        stroke: null
      } );

    // Gravity Control Panel
    var gravityAndDampingControlNode = new GravityAndDampingControlNode(
      model, this, tandem.createTandem( 'gravityAndDampingControlNode' ), {
        minWidth: 1,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        dampingVisible: false,
        xMargin: 0,
        yMargin: 0,
        stroke: null,
        hSlider: true
      } );

    // VBox that contains all of the panel's content
    var optionsVBox = new VBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        gravityAndDampingControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        vectorVisibilityControlNode
      ]
    } );

    // Panel that will display all the toggleable options.
    var optionsPanel = new Panel(
      optionsVBox,
      {
        xMargin: 10,
        fill: MassesAndSpringsConstants.PANEL_FILL,
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'LineVisibilityNode' ),
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
      } );
    this.addChild( optionsPanel );
    optionsPanel.moveToBack();

    this.visibleBoundsProperty.link( function( visibleBounds ) {
      optionsPanel.top = self.secondSpringConstantControlPanel.top;
      optionsPanel.right = self.panelRightSpacing;
      self.toolboxPanel.top = optionsPanel.bottom + self.spacing;
      self.toolboxPanel.right = self.panelRightSpacing;
    } );

    // Determines where we want the force vectors of the attached mass to be placed.
    //REVIEW: Shouldn't directly change spring options. Also, can we do this on spring construction instead?
    model.firstSpring.forcesOrientationProperty.set( -1 );
    model.secondSpring.forcesOrientationProperty.set( 1 );
  }

  massesAndSprings.register( 'VectorsScreenView', VectorsScreenView );

  return inherit( TwoSpringScreenView, VectorsScreenView );
} );
