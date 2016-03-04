// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );

  var Bounds2 = require( 'DOT/Bounds2' );
  var GravityControlPanel = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/GravityControlPanel' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Line = require( 'SCENERY/nodes/Line' );
  var MASRulerNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/MASRulerNode' );
  var MassNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/MassNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/OscillatingSpringNode' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SpringConstantControlPanel = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/SpringConstantControlPanel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  var equilibriumPosString = require( 'string!MASSES_AND_SPRINGS/equilibriumPos' );
  var referenceLineString = require( 'string!MASSES_AND_SPRINGS/referenceLine' );
  var rulerString = require( 'string!MASSES_AND_SPRINGS/ruler' );
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );
  var stopwatchString = require( 'string!MASSES_AND_SPRINGS/stopwatch' );


  var FONT = new PhetFont( 32 );

  /**
   * @param {MassesAndSpringsModel} model
   * @constructor
   */
  function MassesAndSpringsScreenView( model ) {
    this.model = model; // Make model available for reset
    var self = this;
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768 * 2.5, 504 * 2.5
    ) } );

    var mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, this.layoutBounds.height * .98 ),
      1000 );
    this.mvt = mvt; // Make mvt available to descendant types.

    this.viewProperties = new PropertySet( {
      rulerVisible: true,
      stopwatchVisible: false,
      referenceLineVisible: true,
      equilibriumPositionVisible: false
    } );

    //  Node for ComboBox menus.  Add this last.
    var listParentNode = new Node( );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      radius: 48,
      right:  this.layoutBounds.maxX - 10,
      bottom: mvt.modelToViewY( model.floorY )
    } );
    this.addChild( resetAllButton );

    var gravityControlPanel = new GravityControlPanel( model.gravityProperty, model.gravityRange, listParentNode, {
      right: this.layoutBounds.width - 10,
      top: mvt.modelToViewY( .5 ),
      minWidth: 10
    } );
    this.addChild( gravityControlPanel );

    this.addChild( new MASRulerNode( mvt, this.layoutBounds, model.ruler, this.viewProperties.rulerVisibleProperty ) );

    this.referenceLine = new Line( 0, 0, mvt.modelToViewDeltaX( 0.52 ), 0, {
      stroke: 'blue',
      lineDash: [ 20, 15 ],
      lineWidth: 4,
      cursor: 'pointer',
      boundsMethod: 'unstroked'
    } );
    this.referenceLine.mouseArea = this.referenceLine.localBounds.dilated( 10 );
    this.referenceLine.touchArea = this.referenceLine.localBounds.dilated( 10 );
    this.referenceLine.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,
      // Handler that moves the line in model space.
      translate: function( translationParams ) {
        model.referenceLinePosition = model.referenceLinePosition.plus( mvt.viewToModelDelta( translationParams.delta ) );
        return translationParams.position;
      }
    } ) );
    model.referenceLinePositionProperty.link( function( position ) {
      self.referenceLine.translation = mvt.modelToViewPosition( position );
    } );
    this.addChild( this.referenceLine );
    this.viewProperties.referenceLineVisibleProperty.link( function( isVisible ) {
      self.referenceLine.visible = isVisible;
    } );

    // Control Panel for display elements with varying visibility
    var indicatorVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new Text( rulerString, FONT ),
        property: this.viewProperties.rulerVisibleProperty,
        label: rulerString
      },
      {
        content: new Text( referenceLineString, FONT ),
        property: this.viewProperties.referenceLineVisibleProperty,
        label: referenceLineString
      },
      {
        content: new Text( stopwatchString, FONT ),
        property: this.viewProperties.stopwatchVisibleProperty,
        label: stopwatchString
      },
      {
        content: new Text( equilibriumPosString, FONT ),
        property: this.viewProperties.equilibriumPositionVisibleProperty,
        label: equilibriumPosString
      }
    ], { boxWidth: 15, spacing: 5 } );
    var titleToControlsVerticalSpace = 7;
    var indicatorVisibilityControlsVBox = new VBox( {
      children: [
        new VStrut( titleToControlsVerticalSpace ),
        new HBox( { children: [ new HStrut( 10 ), indicatorVisibilityCheckBoxGroup ] } )
      ],
      align: 'left'
    } );
    var indicatorVisibilityControlPanel = new Panel( indicatorVisibilityControlsVBox,
      {
        xMargin: 50,
        fill: 'rgb( 240, 240, 240 )',
        top: 5,
        right: this.layoutBounds.width - 10
      } );
    this.addChild( indicatorVisibilityControlPanel );


    this.addChild( new MassNode( model.masses[0], mvt, 'grey', true ) );
    this.addChild( new MassNode( model.masses[1], mvt, 'grey', true ) );
    this.addChild( new MassNode( model.masses[2], mvt, 'grey', true ) );
    this.addChild( new MassNode( model.masses[3], mvt, 'red', false ) );
    this.addChild( new MassNode( model.masses[4], mvt, 'blue', false ) );
    this.addChild( new MassNode( model.masses[5], mvt, 'green', false ) );

    this.addChild( new OscillatingSpringNode( model.springs[0], mvt ) );
    this.addChild( new SpringConstantControlPanel( model.springs[0].springConstantProperty, model.springs[0].springConstantRange, springConstantString + ' 1', {
      right: this.layoutBounds.width - 10,
      top: mvt.modelToViewY(.75 )
    } ) );
    this.addChild( new OscillatingSpringNode( model.springs[1], mvt ) );
    this.addChild( new SpringConstantControlPanel( model.springs[1].springConstantProperty, model.springs[1].springConstantRange, springConstantString + ' 2', {
      right: this.layoutBounds.width - 10,
      top: mvt.modelToViewY( 1 )
    } ) );

    // This should always be after all nodes containing a ComboBox
    this.addChild( listParentNode );
  }
  massesAndSprings.register( 'MassesAndSpringsScreenView', MassesAndSpringsScreenView );

  return inherit( ScreenView, MassesAndSpringsScreenView, {
    reset: function() {
      this.model.reset();
      this.viewProperties.reset();
    }
  } );
} );